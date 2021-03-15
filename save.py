import sys

print('Content-type: text/html\n')
path_w = 'kifu.json'
recieve = sys.stdin.readline()
with open(path_w, mode='w') as f:
    f.write(recieve)
