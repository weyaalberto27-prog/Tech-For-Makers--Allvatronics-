const fs = require('fs');

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const s3LeftRegex = /\{leftPins\.map\(\(pin, i\) => \(\s*<Group key=\{\"l\" \+ i\}>\s*<Rect x=\{\-44\} y=\{\-84 \+ i \* 8 \- 1\.5\} width=\{6\} height=\{3\} fill=\"\#fbbf24\" cornerRadius=\{1\} \/>\s*<Line points=\{\[\-41, \-84 \+ i \* 8, \-64, \-84 \+ i \* 8\]\} stroke=\"\#fbbf24\" strokeWidth=\{1\} \/>\s*<Circle x=\{\-64\} y=\{\-84 \+ i \* 8\} radius=\{3\.5\} fill=\{selected \? selectedColor : \"\#f8fafc\"\} stroke=\{selected \? selectedColor : \"\#fbbf24\"\} strokeWidth=\{1\.5\} \/>\s*<\/Group>\s*\)\)\}/;

const s3LeftReplacement = `{leftPins.map((pin, i) => (
        <Group key={"l" + i}>
          <Rect x={-44} y={-84 + i * 8 - 1.5} width={6} height={3} fill="#fbbf24" cornerRadius={1} />
          <Line points={[-41, -84 + i * 8, -64, -84 + i * 8]} stroke="#fbbf24" strokeWidth={1} />
          <Circle x={-64} y={-84 + i * 8} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
          <Text text={pin} x={-40} y={-86 + i * 8} fontSize={4} fill="#fff" />
        </Group>
      ))}`;

const s3RightRegex = /\{rightPins\.map\(\(pin, i\) => \(\s*<Group key=\{\"r\" \+ i\}>\s*<Rect x=\{38\} y=\{\-84 \+ i \* 8 \- 1\.5\} width=\{6\} height=\{3\} fill=\"\#fbbf24\" cornerRadius=\{1\} \/>\s*<Line points=\{\[41, \-84 \+ i \* 8, 64, \-84 \+ i \* 8\]\} stroke=\"\#fbbf24\" strokeWidth=\{1\} \/>\s*<Circle x=\{64\} y=\{\-84 \+ i \* 8\} radius=\{3\.5\} fill=\{selected \? selectedColor : \"\#f8fafc\"\} stroke=\{selected \? selectedColor : \"\#fbbf24\"\} strokeWidth=\{1\.5\} \/>\s*<\/Group>\s*\)\)\}/;

const s3RightReplacement = `{rightPins.map((pin, i) => (
        <Group key={"r" + i}>
          <Rect x={38} y={-84 + i * 8 - 1.5} width={6} height={3} fill="#fbbf24" cornerRadius={1} />
          <Line points={[41, -84 + i * 8, 64, -84 + i * 8]} stroke="#fbbf24" strokeWidth={1} />
          <Circle x={64} y={-84 + i * 8} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
          <Text text={pin} x={25} y={-86 + i * 8} fontSize={4} fill="#fff" />
        </Group>
      ))}`;

content = content.replace(s3LeftRegex, s3LeftReplacement);
content = content.replace(s3RightRegex, s3RightReplacement);

fs.writeFileSync('src/components/Symbols.tsx', content);
