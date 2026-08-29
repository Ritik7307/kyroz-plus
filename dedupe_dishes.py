import re

with open('backend/src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if 'const dishData = [' in line:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if '];' in lines[i]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    seen_names = set()
    new_lines = lines[:start_idx + 1]
    
    i = start_idx + 1
    while i <= end_idx:
        line = lines[i]
        
        m = re.search(r"name:\s*'([^']+)'", line)
        if m:
            name = m.group(1)
            if name in seen_names:
                print(f"Removing duplicate dish: {name}")
                i += 1
                continue
            else:
                seen_names.add(name)
                new_lines.append(line)
        else:
            new_lines.append(line)
        i += 1
        
    new_lines.extend(lines[end_idx+1:])
    with open('backend/src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
else:
    print("Could not find dishData")
