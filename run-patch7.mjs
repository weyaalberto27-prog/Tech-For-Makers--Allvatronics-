import fs from 'fs';
let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

content = content.replace(/\} else \{\n    options = \[\n      \{ val: "", label: "-" \},\n      \{ val: "p", label: "p" \},\n      \{ val: "n", label: "n" \},\n      \{ val: "u", label: "µ" \},\n      \{ val: "m", label: "m" \},\n      \{ val: "k", label: "k" \},\n      \{ val: "M", label: "M" \},\n    \];\n  \}/g, `} else if (["powersupply", "battery", "ac_source", "voltmeter", "ammeter", "motor", "buzzer"].includes(componentType)) {
    options = [];
  } else {
    options = [
      { val: "", label: "-" },
      { val: "p", label: "p" },
      { val: "n", label: "n" },
      { val: "u", label: "µ" },
      { val: "m", label: "m" },
      { val: "k", label: "k" },
      { val: "M", label: "M" },
    ];
  }`);

content = content.replace(/<select\n        value=\{scaleVal\}\n        onChange=\{handleScaleChange\}\n        className="bg-\[#2d2d33\] text-gray-300 text-\[10px\] outline-none px-1 border-l border-\[#2d2d33\] cursor-pointer"\n      >\n        \{options\.map\(\(opt\) => \(\n          <option key=\{opt\.val\} value=\{opt\.val\}>\n            \{opt\.label\}\n          <\/option>\n        \)\)\}\n      <\/select>/g, `{options.length > 0 && (
      <select
        value={scaleVal}
        onChange={handleScaleChange}
        className="bg-[#2d2d33] text-gray-300 text-[10px] outline-none px-1 border-l border-[#2d2d33] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.val} value={opt.val}>
            {opt.label}
          </option>
        ))}
      </select>
      )}`);

fs.writeFileSync('src/components/PropertiesPanel.tsx', content, 'utf8');
console.log("Patched PropertiesPanel.");
