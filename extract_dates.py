from datetime import datetime, timedelta
import pandas as pd
import json

PUBLIC_HOLIDAYS = None
OFF_DAYS = None
FIRST_DATE = None
LAST_DATE = None
configs = None


def get_travel_days(off_stops, df):
    search_pattern = fr"^Check-in en -uit: .* - ({"|".join(off_stops)})$"
    travel_days_df = df[df['Omschrijving'].str.match(search_pattern)]
    travel_days_df["Datum"] = pd.to_datetime(travel_days_df["Datum"], format="%d-%m-%y")
    travel_days_df["late"] = travel_days_df["Check uit"] > "12:00"
    travel_days_df = travel_days_df[["Datum", "late"]].groupby(by=["Datum"]).all().reset_index()
    travel_days = travel_days_df["Datum"].tolist()
    late_travel_days = travel_days_df[travel_days_df["late"]]["Datum"].tolist()
    
    return travel_days, late_travel_days

# read config files
with open("extract_dates.config.json") as f:
    configs = json.load(f)
    PUBLIC_HOLIDAYS = list(datetime.strptime(day_i, '%Y-%m-%d')
                           for day_i in configs["public_holidays"])
    OFF_DAYS = list(datetime.strptime(day_i, '%Y-%m-%d')
                    for day_i in configs["off_days"])
    FIRST_DATE = datetime.strptime(configs["first_date"], '%Y-%m-%d')
    LAST_DATE = datetime.strptime(configs["last_date"], '%Y-%m-%d')
    OFF_STOPS = configs["off_stops"]
    NS_FILE_NAME = configs["ns_file_name"]

travel_history_df = pd.read_excel(
    NS_FILE_NAME, usecols=["Datum", "Omschrijving", "Check uit"])

travel_days, late_travel_days = get_travel_days(OFF_STOPS, travel_history_df)
morning_travel_days = list(set(travel_days) - set(late_travel_days))

# compute days within specified period
day_diff = (LAST_DATE - FIRST_DATE).days
days_in_between = list(FIRST_DATE + timedelta(days=offset_i)
                       for offset_i in range(day_diff+1))
print(f"last date: {days_in_between[-1]}")

# compute WFH dates
wfh_days = list(date_i for date_i in days_in_between
                if (date_i.weekday() < 5)
                and (date_i not in morning_travel_days)
                and (date_i not in PUBLIC_HOLIDAYS)
                and (date_i not in OFF_DAYS))

out_dict = {"wfh_days": []}
for day_i in wfh_days:
    d_str = day_i.strftime("%d/%m/%Y")
    out_dict["wfh_days"].append(d_str)
    print(f"{d_str}{' late_travel' if day_i in late_travel_days else ''}")


with open("extract_dates.out", "w") as f:
    json.dump(out_dict, f)