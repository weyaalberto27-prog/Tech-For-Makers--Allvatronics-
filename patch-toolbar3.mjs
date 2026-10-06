import fs from 'fs';

let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const themeButtons = `
          <div className="w-px bg-gray-600 mx-1 my-1"></div>
          <button
            onClick={() => setBoardTheme('dark')}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
              boardTheme === "dark"
                ? "bg-slate-700 text-white"
                : "text-gray-400 hover:text-white"
            )}
            title="Modo Escuro"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setBoardTheme('light')}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
              boardTheme === "light"
                ? "bg-slate-200 text-slate-900"
                : "text-gray-400 hover:text-white"
            )}
            title="Modo Claro"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
`;

content = content.replace(themeButtons, '');

const newThemeToggle = `
        {!is3DView && (
          <div className="flex bg-[#2d2d33] rounded-lg p-1 mr-2 hidden sm:flex">
            <button
              onClick={() => setBoardTheme('dark')}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
                boardTheme === "dark"
                  ? "bg-slate-700 text-white"
                  : "text-gray-400 hover:text-white"
              )}
              title="Modo Escuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBoardTheme('light')}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
                boardTheme === "light"
                  ? "bg-slate-200 text-slate-900"
                  : "text-gray-400 hover:text-white"
              )}
              title="Modo Claro"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
`;

content = content.replace(
  '{mode === "pcb" && !is3DView && userMode === "pro" && (',
  newThemeToggle + '\n        {mode === "pcb" && !is3DView && userMode === "pro" && ('
);

fs.writeFileSync('src/components/Toolbar.tsx', content);
