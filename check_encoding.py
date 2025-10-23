import pathlib
line = next(l for l in pathlib.Path('src/components/chapters/MomentTemplateCard.tsx').read_text(encoding='utf-8').splitlines() if '\u2022' in l or '•' in l)
print(line.encode('unicode_escape').decode('ascii'))
