import re

with open('../frontend/src/app/dashboard/costing/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove handleResetMaster
pattern = r"  const handleResetMaster = async \(\) => \{[\s\S]*?\};\n"
c = re.sub(pattern, "", c)

# Remove the reset button UI
old_ui = """            <div className="w-full flex gap-2 items-center">
              <div className="flex-1">
                <CustomDropdown
                options={dishes}
                value={selectedDishId}
                onChange={setSelectedDishId}
                label="Selected Restaurant Dish"
                placeholder="Choose a dish to analyze"
              />
              </div>
              <button 
                onClick={handleResetMaster}
                className="mt-6 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl border border-red-500/50 transition-all font-bold text-xs tracking-wider"
              >
                RESET
              </button>
            </div>"""

new_ui = """            <div className="w-full">
              <CustomDropdown
                options={dishes}
                value={selectedDishId}
                onChange={setSelectedDishId}
                label="Selected Restaurant Dish"
                placeholder="Search or choose a dish to analyze"
                searchable={true}
              />
            </div>"""

c = c.replace(old_ui, new_ui)

with open('../frontend/src/app/dashboard/costing/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed reset button and added searchable prop")
