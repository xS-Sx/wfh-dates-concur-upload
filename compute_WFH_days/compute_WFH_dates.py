from datetime import datetime, timedelta
import pandas as pd

PUBLIC_HOLIDAYS = [
    '25-12-2024',
    '26-12-2024',
    '01-01-2025',
    '20-04-2025',
    '21-04-2025',
    '26-04-2025',
    '05-05-2025',
    '29-05-2025',
    '30-05-2025',
    '08-09-2025',
    '25-12-2025',
    '26-12-2025',
]

PERSONAL_HOLIDAYS = [

]

START_DATE_STR = '20241201'
END_DATE_STR = '20250131'

def get_in_office_days(ns_history_file='reistransacties.xls'):
    df = pd.read_excel(ns_history_file, usecols=['Dag', 'Datum', 'Check uit', 'Bestemming'])
    df_filtered = df[(df['Check uit'] < '12:00')  \
                    & (~df['Dag'].isin(['za', 'zo'])) \
                    & (df['Bestemming'] == 'Amsterdam Zuid')]
    in_office_days = list(datetime.strptime(day_i, '%d-%m-%y') 
                        for day_i in df_filtered['Datum'])
    
    return in_office_days

in_office_days = get_in_office_days()

# parse date string
first_date = datetime.strptime(START_DATE_STR, '%Y%m%d')
last_date = datetime.strptime(END_DATE_STR, '%Y%m%d')
public_holidays = list(datetime.strptime(day_i, '%d-%m-%Y') for day_i in PUBLIC_HOLIDAYS)
personal_holidays = list(datetime.strptime(day_i, '%d-%m-%Y') for day_i in PERSONAL_HOLIDAYS)

# compute days within specified period
day_diff = (last_date - first_date).days
days_in_between = list(first_date + timedelta(days=offset_i) 
                for offset_i in range(day_diff+1))

# compute WFH dates
wfh_days = list(date_i for date_i in days_in_between 
                if (date_i.weekday() < 5) 
                    and (date_i not in in_office_days)
                    and (date_i not in public_holidays)
                    and (date_i not in personal_holidays))

for day_i in wfh_days:
    print(day_i.strftime('%d/%m/%Y'))
