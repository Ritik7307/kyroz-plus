import re

with open('backend/src/services/blueprintSeeder.service.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the start of dishRecipeMappings
start_idx = -1
for i, line in enumerate(lines):
    if 'const dishRecipeMappings' in line:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if '};' in lines[i] and '}' == lines[i].strip().replace(';', ''):
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    seen_keys = set()
    new_lines = lines[:start_idx + 1]
    
    i = start_idx + 1
    while i <= end_idx:
        line = lines[i]
        
        # Check if line is a key definition
        # usually looks like: 'Mix-Veg Uttapam': [
        m = re.match(r"^\s*'([^']+)'\s*:\s*\[", line)
        if m:
            key = m.group(1)
            if key in seen_keys:
                print(f"Removing duplicate key: {key}")
                # Skip until we find the closing ]
                # But wait, it might be a single line: 'Mix-Veg Uttapam': [ ... ],
                if '],' in line or ']' in line and not line.strip().endswith('['):
                    i += 1
                    continue
                else:
                    i += 1
                    while i <= end_idx and not re.match(r"^\s*\],?", lines[i]):
                        i += 1
                    i += 1 # skip the closing ]
                    continue
            else:
                seen_keys.add(key)
                new_lines.append(line)
        else:
            new_lines.append(line)
        i += 1
        
    new_lines.extend(lines[end_idx+1:])
    with open('backend/src/services/blueprintSeeder.service.ts', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
else:
    print("Could not find dishRecipeMappings")
