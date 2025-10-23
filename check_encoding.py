import pathlib
text = pathlib.Path('src/lib/mockData.ts').read_text(encoding='utf-8')
start = text.index('Descoberta')
print(text[start:start+200].encode('unicode_escape').decode('ascii'))
