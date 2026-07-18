import re

with open('../frontend/src/app/dashboard/costing/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add the handleResetMaster function inside the component
func = """  const handleResetMaster = async () => {
    if(!confirm('Are you sure you want to delete ALL dishes? This will force a fresh blueprint seed on next load!')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(API_URL + '/api/dishes/all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('All dishes deleted. Refreshing to seed new blueprints...');
      window.location.reload();
    } catch(err) {
      alert('Error resetting master');
    }
  };
"""

c = c.replace('// Fetch Inventory', func + '\n  // Fetch Inventory')

# Add the button in the UI
# Find <div className="w-full"> that wraps CustomDropdown
old_ui = """            <div className="w-full">
              <CustomDropdown"""

new_ui = """            <div className="w-full flex gap-2 items-center">
              <div className="flex-1">
                <CustomDropdown"""

c = c.replace(old_ui, new_ui)

old_ui2 = """                label="Selected Restaurant Dish"
                placeholder="Choose a dish to analyze"
              />
            </div>"""

new_ui2 = """                label="Selected Restaurant Dish"
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

c = c.replace(old_ui2, new_ui2)

with open('../frontend/src/app/dashboard/costing/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected reset button")
