import fs from 'fs';
let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');
content = content.replace(
  'if (["powersupply", "battery", "ac_source", "voltmeter"].includes(type))',
  'if (["powersupply", "battery", "ac_source", "voltmeter", "lamp"].includes(type))'
);
content = content.replace(
  '["powersupply", "battery", "ac_source", "voltmeter", "ammeter", "motor", "buzzer"].includes(componentType)',
  '["powersupply", "battery", "ac_source", "voltmeter", "ammeter", "motor", "buzzer", "lamp"].includes(componentType)'
);
content = content.replace(
  '["powersupply", "battery", "ac_source"].includes(\n                    (comp as ComponentEntity).componentType,\n                  )',
  '["powersupply", "battery", "ac_source", "lamp"].includes(\n                    (comp as ComponentEntity).componentType,\n                  )'
);
fs.writeFileSync('src/components/PropertiesPanel.tsx', content, 'utf8');
