import fs from 'fs';
let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const target = `{/* Holes Grid top power */}
      {[...Array(60)].map((_, c) =>
        Math.floor(c / 5) % 2 === 0 ? (
          <Group key={"pt" + c}>
            {/* Top Row: -100V / GND */}
            <Rect
              x={-293 + c * 10}
              y={-93}
              width={6}
              height={6}
              cornerRadius={1}
              fill="#cbd5e1" // Metal bevel/rim
              stroke="#94a3b8"
              strokeWidth={0.5}
            />
            <Rect
              x={-291.5 + c * 10}
              y={-91.5}
              width={3}
              height={3}
              cornerRadius={0.5}
              fill="#090d16" // Dark metal spring contact slot
            />
            {/* Bottom Row: +5V */}
            <Rect
              x={-293 + c * 10}
              y={-83}
              width={6}
              height={6}
              cornerRadius={1}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth={0.5}
            />
            <Rect
              x={-291.5 + c * 10}
              y={-81.5}
              width={3}
              height={3}
              cornerRadius={0.5}
              fill="#090d16"
            />
          </Group>
        ) : null,
      )}

      {/* Holes Grid bottom power */}
      {[...Array(60)].map((_, c) =>
        Math.floor(c / 5) % 2 === 0 ? (
          <Group key={"pb" + c}>
            {/* Top Row: +5V */}
            <Rect
              x={-293 + c * 10}
              y={87}
              width={6}
              height={6}
              cornerRadius={1}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth={0.5}
            />
            <Rect
              x={-291.5 + c * 10}
              y={88.5}
              width={3}
              height={3}
              cornerRadius={0.5}
              fill="#090d16"
            />
            {/* Bottom Row: -100V / GND */}
            <Rect
              x={-293 + c * 10}
              y={77}
              width={6}
              height={6}
              cornerRadius={1}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth={0.5}
            />
            <Rect
              x={-291.5 + c * 10}
              y={78.5}
              width={3}
              height={3}
              cornerRadius={0.5}
              fill="#090d16"
            />
          </Group>
        ) : null,
      )}

      {/* Holes Grid middle top/bot */}
      {[...Array(60)].map((_, c) =>
        [...Array(5)].map((_, r) => (
          <Group key={"ct" + c + "_" + r}>
            <Rect
              x={-293 + c * 10}
              y={-63 + r * 10}
              width={6}
              height={6}
              cornerRadius={1}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth={0.5}
            />
            <Rect
              x={-291.5 + c * 10}
              y={-61.5 + r * 10}
              width={3}
              height={3}
              cornerRadius={0.5}
              fill="#090d16"
            />
          </Group>
        )),
      )}
      {[...Array(60)].map((_, c) =>
        [...Array(5)].map((_, r) => (
          <Group key={"cb" + c + "_" + r}>
            <Rect
              x={-293 + c * 10}
              y={17 + r * 10}
              width={6}
              height={6}
              cornerRadius={1}
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth={0.5}
            />
            <Rect
              x={-291.5 + c * 10}
              y={18.5 + r * 10}
              width={3}
              height={3}
              cornerRadius={0.5}
              fill="#090d16"
            />
          </Group>
        )),
      )}`;

const replacement = `{/* Single Shape rendering all holes for extreme performance */}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          for (let c = 0; c < 60; c++) {
            if (Math.floor(c / 5) % 2 === 0) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-293 + c * 10, -93, 6, 6, 1);
                context.roundRect(-293 + c * 10, -83, 6, 6, 1);
                context.roundRect(-293 + c * 10, 87, 6, 6, 1);
                context.roundRect(-293 + c * 10, 77, 6, 6, 1);
              } else {
                context.rect(-293 + c * 10, -93, 6, 6);
                context.rect(-293 + c * 10, -83, 6, 6);
                context.rect(-293 + c * 10, 87, 6, 6);
                context.rect(-293 + c * 10, 77, 6, 6);
              }
            }
            for (let r = 0; r < 5; r++) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-293 + c * 10, -63 + r * 10, 6, 6, 1);
                context.roundRect(-293 + c * 10, 17 + r * 10, 6, 6, 1);
              } else {
                context.rect(-293 + c * 10, -63 + r * 10, 6, 6);
                context.rect(-293 + c * 10, 17 + r * 10, 6, 6);
              }
            }
          }
          context.fillStyle = "#cbd5e1";
          context.fill();
          context.strokeStyle = "#94a3b8";
          context.lineWidth = 0.5;
          context.stroke();

          context.beginPath();
          for (let c = 0; c < 60; c++) {
            if (Math.floor(c / 5) % 2 === 0) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-291.5 + c * 10, -91.5, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, -81.5, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, 88.5, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, 78.5, 3, 3, 0.5);
              } else {
                context.rect(-291.5 + c * 10, -91.5, 3, 3);
                context.rect(-291.5 + c * 10, -81.5, 3, 3);
                context.rect(-291.5 + c * 10, 88.5, 3, 3);
                context.rect(-291.5 + c * 10, 78.5, 3, 3);
              }
            }
            for (let r = 0; r < 5; r++) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-291.5 + c * 10, -61.5 + r * 10, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, 18.5 + r * 10, 3, 3, 0.5);
              } else {
                context.rect(-291.5 + c * 10, -61.5 + r * 10, 3, 3);
                context.rect(-291.5 + c * 10, 18.5 + r * 10, 3, 3);
              }
            }
          }
          context.fillStyle = "#090d16";
          context.fill();
        }}
      />`;

const newContent = content.replace(target, replacement);

if (newContent !== content) {
    fs.writeFileSync('src/components/Symbols.tsx', newContent, 'utf8');
    console.log("Successfully replaced Holes Grid.");
} else {
    console.log("Target not found!");
}
