# -*- coding: utf-8 -*-

import easyocr
import sys

if len(sys.argv) != 3:
    raise Exception("Il faut mentionner l'image et la destination")

IMAGE_FULL_PATH = sys.argv[1]
DEST_FULL_PATH = sys.argv[2] + '.txt'

reader = easyocr.Reader(['en'])
result = reader.readtext(IMAGE_FULL_PATH)
sys.stdout.write('TRAITEMENT DE ' + IMAGE_FULL_PATH)
with open(DEST_FULL_PATH, 'w') as dest_file_txt:
    for element in result:
        dest_file_txt.write(element[1] + '\n')
    sys.stdout.write(DEST_FULL_PATH + ' GENERE')