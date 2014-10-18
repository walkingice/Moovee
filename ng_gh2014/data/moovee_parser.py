# -*- coding: utf8 -*-

import csv
import sys
import json
import datetime

def parse_txt(tsv_filename):
    data = {}
    data['items'] = []
    key_list = []
    with open(tsv_filename, 'r') as tsv:
        for r_idx, row in enumerate(csv.reader(tsv, dialect='excel-tab')):
            if r_idx is 0:
                key_list = row
            else:
                movie = {}
                for c_idx, cell in enumerate(row):
                    movie[key_list[c_idx]] = cell
                    #print cell
                data['items'].append(movie)
    return data

def format_data(data):
    for item in data['items']:
        datetime_str = item['DATE'] + ' ' + item['TIME']
        duration_mins = int(item['DURATION'])
        start = datetime.datetime.strptime(datetime_str, '%Y/%m/%d %H:%M')
        end = start + datetime.timedelta(0, 0, 0, 0, duration_mins)
        item['START_DATETIME'] = start.isoformat()
        item['END_DATETIME'] = end.isoformat()
    return data

def main():
    data = parse_txt(sys.argv[1])
    formated = format_data(data)
    print (json.dumps(formated, indent = 2, ensure_ascii = False))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        main()
    else:
        print ''
        print '\tpython ' + sys.argv[0] + ' <FILENAME>'
