import sys
import re

with open('../frontend/src/components/ui/CustomDropdown.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add searchable to props interface
c = c.replace('  placeholder?: string;\n}', '  placeholder?: string;\n  searchable?: boolean;\n}')

# Add searchable to parameters
c = c.replace('export default function CustomDropdown({ options, value, onChange, label, placeholder }: CustomDropdownProps) {', 
              'export default function CustomDropdown({ options, value, onChange, label, placeholder, searchable }: CustomDropdownProps) {')

# Add search query state
c = c.replace('  const dropdownRef = useRef<HTMLDivElement>(null);', 
              '  const dropdownRef = useRef<HTMLDivElement>(null);\n  const [searchQuery, setSearchQuery] = useState("");')

# Filter options
c = c.replace('  const selectedOption = options.find(opt => opt.value === value);',
              """  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase())) 
    : options;""")

# Add search input UI before options
search_ui = """            {searchable && (
              <div className="p-2 border-b border-white/10">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">"""

c = c.replace('            <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">', search_ui)

# Replace options.map with filteredOptions.map
c = c.replace('{options.map((option) => (', '{filteredOptions.map((option) => (')

with open('../frontend/src/components/ui/CustomDropdown.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated CustomDropdown with searchable prop")
