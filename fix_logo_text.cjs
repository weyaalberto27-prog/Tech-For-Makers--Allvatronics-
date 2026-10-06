const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasViewer3D.tsx", "utf8");

content = content.replace(
  `          <Text position={[0, 0.2, 45]} rotation={[-Math.PI/2, 0, 0]} fontSize={20} color="#ffffff" fillOpacity={0.4} fontStyle="italic" anchorX="center">
        ALLVATRONICS
      </Text>
    </group>
  );
}`,
  `    </group>\n  );\n}`
);

content = content.replace(
  `      <mesh position={[6.25, 0, 8.75]} rotation={[0, line2Ang, 0]}>
         <boxGeometry args={[line2Len, 0.2, 8]} />
         <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>
    </group>`,
  `      <mesh position={[6.25, 0, 8.75]} rotation={[0, line2Ang, 0]}>
         <boxGeometry args={[line2Len, 0.2, 8]} />
         <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>
      <Text position={[0, 0.2, 45]} rotation={[-Math.PI/2, 0, 0]} fontSize={20} color="#ffffff" fillOpacity={0.4} fontStyle="italic" fontWeight="bold" anchorX="center">
        ALLVATRONICS
      </Text>
    </group>`
);

fs.writeFileSync("src/components/CanvasViewer3D.tsx", content);
