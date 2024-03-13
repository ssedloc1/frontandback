import csv
import sqlite3
import json
import importlib
from datetime import datetime
from time import time, sleep


def create_database():
    connection = sqlite3.connect('data.db')
    cursor = connection.cursor()
    create_table = '''CREATE TABLE Power_Data(Timestamp REAL,
                   V_RMS REAL, I_RMS REAL, Real_Power REAL, Reactive_Power REAL,
                   Apparent_Power REAL, Power_Factor REAL);
                   '''
    cursor.execute(create_table)
    connection.commit()
    connection.close()

def insert_data():
    connection = sqlite3.connect('data.db')
    cursor = connection.cursor()
    file = open('data.csv')
    contents = csv.reader(file)
    SQL = "INSERT INTO Power_Data (Timestamp, V_RMS, I_RMS, Real_Power, Reactive_Power, Apparent_Power, Power_Factor) VALUES(?, ?, ?, ?, ?, ?, ?)"
    cursor.executemany(SQL, contents)
    connection.commit()
    connection.close()
    

def create_json():
    connection = sqlite3.connect('data.db')
    cursor = connection.cursor()
    query = "SELECT * FROM Power_Data"
    result = cursor.execute(query)
    items = []
    for row in result:
        items.append({'Time_sampled': row[0], 'V_RMS': row[1], 'I_RMS': row[2], 'Real_Power': row[3],
                      'Reactive_Power': row[4], 'Apparent_Power': row[5], 'Power_Factor': row[6]})
    connection.close()
    json_object = json.dumps(items, indent=4)
    with open("new_data.json", "w") as outfile:
        outfile.write(json_object)
        
def update_json():
    connection = sqlite3.connect('data.db')
    cursor = connection.cursor()
    query = "SELECT * FROM Power_Data"
    result = cursor.execute(query)
    items = []
    for row in result:
        items.append({'Time_sampled': row[0], 'V_RMS': row[1], 'I_RMS': row[2], 'Real_Power': row[3],
                      'Reactive_Power': row[4], 'Apparent_Power': row[5], 'Power_Factor': row[6]})
    connection.close()
    json_object = json.dumps(items, indent=4)
    with open("new_data.json", "w") as outfile:
        outfile.write(json_object)


def num_lines():
    connection = sqlite3.connect('data.db')
    cursor = connection.cursor()
    query = "SELECT * FROM Power_Data"
    result = cursor.execute(query)
    line_count = len(list(result))
    connection.commit()
    connection.close()
    return line_count


def clear_table():
    connection = sqlite3.connect('data.db')
    cursor = connection.cursor()
    cursor.execute('DELETE FROM Power_data;')
    connection.commit()
    connection.close()


#select_all = "SELECT * FROM data"

#rows = cursor.execute(select_all).fetchall()

#for r in rows:
    #print(r)


create_database()
create_json()

while True:
    insert_data()
    if num_lines() == 691200:
        clear_table()
    update_json()
    sleep(60)




