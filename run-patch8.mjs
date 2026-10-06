import fs from 'fs';
let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

const target = `  if (!unit) {
    return (
      <Input
        value={value || ""}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder="Valor"
      />
    );
  }`;

const replacement = `  if (!unit) {
    if (["transistor", "transistor_pnp"].includes(componentType)) {
      return (
        <select
          value={value || (componentType === "transistor" ? "BC547" : "BC557")}
          onChange={(e: any) => onChange(e.target.value)}
          className="bg-[#0f0f13] border border-[#2d2d33] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 w-full"
        >
          {componentType === "transistor" ? (
            <>
              <option value="BC547">BC547 (NPN, Geral)</option>
              <option value="BC548">BC548 (NPN, Geral)</option>
              <option value="2N2222">2N2222 (NPN, Comutação)</option>
              <option value="2N3904">2N3904 (NPN, Comutação)</option>
              <option value="TIP120">TIP120 (Darlington NPN, Potência)</option>
              <option value="BD139">BD139 (NPN, Potência média)</option>
            </>
          ) : (
            <>
              <option value="BC557">BC557 (PNP, Geral)</option>
              <option value="BC558">BC558 (PNP, Geral)</option>
              <option value="2N2907">2N2907 (PNP, Comutação)</option>
              <option value="2N3906">2N3906 (PNP, Comutação)</option>
              <option value="TIP125">TIP125 (Darlington PNP, Potência)</option>
              <option value="BD140">BD140 (PNP, Potência média)</option>
            </>
          )}
        </select>
      );
    } else if (["mosfet", "mosfet_p"].includes(componentType)) {
      return (
        <select
          value={value || (componentType === "mosfet" ? "IRF520" : "IRF9540")}
          onChange={(e: any) => onChange(e.target.value)}
          className="bg-[#0f0f13] border border-[#2d2d33] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 w-full"
        >
          {componentType === "mosfet" ? (
            <>
              <option value="IRF520">IRF520 (Canal N, 100V 9A)</option>
              <option value="IRFZ44N">IRFZ44N (Canal N, 55V 49A)</option>
              <option value="IRF3205">IRF3205 (Canal N, 55V 110A)</option>
              <option value="2N7000">2N7000 (Canal N, Pequeno Sinal)</option>
              <option value="BSS138">BSS138 (Canal N, Logic Level)</option>
              <option value="IRLB8721">IRLB8721 (Canal N, Logic Level)</option>
            </>
          ) : (
            <>
              <option value="IRF9540">IRF9540 (Canal P, -100V -19A)</option>
              <option value="IRF4905">IRF4905 (Canal P, -55V -74A)</option>
              <option value="BSS84">BSS84 (Canal P, Pequeno Sinal)</option>
              <option value="NDP6020P">NDP6020P (Canal P, Logic Level)</option>
            </>
          )}
        </select>
      );
    }

    return (
      <Input
        value={value || ""}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder="Valor"
      />
    );
  }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/PropertiesPanel.tsx', content, 'utf8');
console.log("Patched PropertiesPanel with transistor/MOSFET dropdowns.");
