import React from "react";
import { useEditor } from "../store";
import { ComponentEntity, PcbComponentEntity, AnyElement } from "../types";
import {
  Settings2,
  RotateCw,
  AlignVerticalSpaceAround,
  Crosshair,
  Layers,
  Zap,
  Type,
  AlignLeft,
  Scale3d,
  Code,
  Lightbulb,
  Sparkles,
  Bot
} from "lucide-react";
import { cn } from "../lib/utils";

interface SectionProps {
  title: string;
  icon: React.ElementType<{ className?: string }>;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <div className="pb-4 mb-4 border-b border-[#2d2d33] last:border-0">
      <div className="flex items-center gap-2 mb-3 text-gray-400">
        <Icon className="w-4 h-4" />
        <h4 className="text-xs font-semibold tracking-wider uppercase">
          {title}
        </h4>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function PropertyRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-500 min-w-[70px]">{label}</span>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}

function getDefaultUnit(type: string) {
  if (type.includes("resistor") || type === "potentiometer") return "Ω";
  if (type.includes("capacitor")) return "F";
  if (type === "inductor") return "H";
  if (["powersupply", "battery", "ac_source", "voltmeter", "lamp"].includes(type))
    return "V";
  if (type === "ammeter") return "A";
  if (type === "motor") return "rpm";
  if (type === "buzzer") return "Hz";
  return "";
}

function ValueUnitInput({
  value,
  onChange,
  componentType,
}: {
  value: string;
  onChange: (val: string) => void;
  componentType: string;
}) {
  const unit = getDefaultUnit(componentType);
  if (!unit) {
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
  }

  // Extract number and scale (k, m, u, n, p, M)
  const match = (value || "").match(/^([\d.]+)\s*([kKmMunp]?)/);
  const numVal = match ? match[1] : "";
  const scaleVal = match ? match[2] : "";

  const handleNumChange = (e: any) =>
    onChange(`${e.target.value}${scaleVal}${unit}`);
  const handleScaleChange = (e: any) =>
    onChange(`${numVal}${e.target.value}${unit}`);

  let options: { val: string; label: string }[] = [];
  
  if (componentType === "resistor" || componentType === "potentiometer") {
    options = [
      { val: "", label: "-" },
      { val: "k", label: "k" },
      { val: "M", label: "M" },
    ];
  } else if (componentType === "capacitor") { // ceramic
    options = [
      { val: "p", label: "p" },
      { val: "n", label: "n" },
      { val: "u", label: "µ" },
    ];
  } else if (componentType === "capacitor_elec") { // electrolytic
    options = [
      { val: "u", label: "µ" },
      { val: "m", label: "m" },
    ];
  } else if (componentType === "inductor") {
    options = [
      { val: "n", label: "n" },
      { val: "u", label: "µ" },
      { val: "m", label: "m" },
      { val: "", label: "-" },
    ];
  } else if (["powersupply", "battery", "ac_source", "voltmeter", "ammeter", "motor", "buzzer", "lamp"].includes(componentType)) {
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
  }

  return (
    <div className="flex bg-[#0f0f13] border border-[#2d2d33] rounded overflow-hidden focus-within:border-blue-500 w-full transition-all">
      <input
        type="number"
        step="any"
        value={numVal}
        onChange={handleNumChange}
        className="w-full bg-transparent px-2 py-1 outline-none text-white text-xs font-mono text-right"
        placeholder="10"
      />
      {options.length > 0 && (
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
      )}
      <div className="bg-[#2d2d33] text-gray-400 text-xs px-2 py-1 flex items-center justify-center font-mono">
        {unit}
      </div>
    </div>
  );
}
function Input({
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
  max,
  step,
  className,
}: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={cn(
        "w-full bg-[#0f0f13] px-2 py-1 rounded border border-[#2d2d33] text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none text-white text-xs transition-all",
        type === "number" && "font-mono",
        className,
      )}
    />
  );
}

function McuCodeEditor({ comp, updateElement }: { comp: ComponentEntity; updateElement: any }) {
  const { setIsSimulating } = useEditor();
  const [localCode, setLocalCode] = React.useState(comp.customProps?.code || "");
  const prevIdRef = React.useRef(comp.id);

  React.useEffect(() => {
    if (prevIdRef.current !== comp.id) {
      setLocalCode(comp.customProps?.code || "");
      prevIdRef.current = comp.id;
    }
  }, [comp.id, comp.customProps?.code]);

  return (
    <Section title="Código C++ (Microcontrolador)" icon={Code}>
      <p className="text-[9px] text-gray-500 mb-2 leading-tight">
        Código específico para este componente. (Substitui o código global).
      </p>
      <textarea
        value={localCode}
        onChange={(e: any) => setLocalCode(e.target.value)}
        className="w-full h-48 bg-[#0f0f13] text-gray-300 font-mono text-[10px] p-2 border border-[#2d2d33] rounded focus:border-blue-500 outline-none resize-none custom-scrollbar"
        placeholder="void setup() {&#10;  pinMode(13, OUTPUT);&#10;}&#10;&#10;void loop() {&#10;  digitalWrite(13, HIGH);&#10;  delay(1000);&#10;  digitalWrite(13, LOW);&#10;  delay(1000);&#10;}"
      />
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => {
            updateElement(comp.id, {
              customProps: {
                ...(comp as ComponentEntity).customProps,
                code: localCode,
              },
            });
            const btn = document.getElementById("btn-compile-" + comp.id);
            if(btn) {
              const original = btn.innerText;
              btn.innerText = "Salvo e Atualizado!";
              btn.classList.add("bg-green-600");
              setTimeout(() => {
                btn.innerText = original;
                btn.classList.remove("bg-green-600");
              }, 2000);
            }
            setIsSimulating(true);
          }}
          id={`btn-compile-${comp.id}`}
          type="button"
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-1.5 rounded transition-colors"
        >
          Compilar & Atualizar
        </button>
      </div>
    </Section>
  );
}

function AIAssistantTip({ componentType, mode, tutorialId }: { componentType?: string, mode: string, tutorialId?: string | null }) {
  const [tip, setTip] = React.useState("");
  const [typingIndex, setTypingIndex] = React.useState(0);

  React.useEffect(() => {
    let newTip = "";
    
    if (tutorialId) {
      if (tutorialId === 'blink') {
        newTip = "Bem-vindo ao exemplo Pisca LED! O seu objetivo é ligar o LED ao Arduino e programá-lo. 1. Adicione um resistor em série com o LED. 2. Ligue ao pino 13 do Arduino. 3. Clique em 'AllvaCreator' para ver o código!";
      } else if (tutorialId === 'motor') {
        newTip = "Exemplo Controle de Motor DC! O motor puxa muita energia, por isso usamos uma bateria de 9V. Ligue o botão em série para poder ligar e desligar o circuito. Tente adicionar o botão e simular.";
      } else if (tutorialId === 'simple') {
        newTip = "Circuito Simples com Bateria e LED. A bateria 3V precisa de um pequeno resistor (ex: 100Ω) para não queimar o LED. Ligue o circuito e pressione 'Play' para simular!";
      } else {
        newTip = "Explore este projeto exemplo. Analise as conexões e tente alterar valores para ver o que acontece na simulação.";
      }
    } else if (componentType) {
      if (mode === 'pcb') {
       const pcbTips: Record<string, string> = {
         'arduino_uno': "No PCB, componentes como o Arduino muitas vezes usam conectores 'pinheader' para serem encaixados externamente. Rotear as conexões de alimentação requer trilhas mais largas.",
         'led': "LEDs têm polaridade estrita! O pad quadrado costuma indicar o pino 1 (Anodo ou Catodo, dependendo do footprint).",
         'resistor': "Vai soldar à mão? Resistores Through-Hole são perfeitos para começar. SMD 0805 ou 1206 também são fáceis de soldar com pinça.",
         'battery': "As linhas de alimentação da bateria (VCC e GND) devem usar trilhas mais grossas (ex: 0.5mm a 1mm) para suportar a corrente.",
         'cr2032': "Suportes de bateria CR2032 ocupam espaço. Garanta que a inserção da bateria não seja bloqueada por outros componentes.",
         'switch': "Quando colocar um botão no PCB, alinhe bem com a borda da placa se quiser que ele fique acessível do lado de fora da caixa.",
         'motor': "Motores não são montados diretamente na placa! Colocamos blocos de terminais (Terminal Block) ou pads para soldar os fios do motor.",
         'pad': "Pads são pontos de solda para fios externos ou para criar seus próprios componentes (footprints customizados).",
         'via': "Vias conectam a camada superior (Top) à inferior (Bottom). Não faça vias muito pequenas se o fabricante de PCB não suportar (padrão seguro: broca de 0.3mm).",
         'copper_pour': "O Plano de Cobre (Copper Pour) preenche o espaço vazio com GND, ajudando na dissipação de calor e reduzindo ruídos elétricos.",
         'fiducial': "Marcas fiduciais ajudam as máquinas pick-and-place a alinhar os componentes SMD com precisão na montagem automática.",
         'mounting_hole': "Não se esqueça dos furos de montagem! Sem eles, como vai prender a sua placa na caixa do projeto?",
         'test_point': "Test points são úteis para debugar a placa com um multímetro ou osciloscópio sem correr o risco de dar curto nos pinos dos CIs.",
         'dip8': "CIs DIP8 (Through-Hole) são ótimos para soquetes. Você solda o soquete e depois encaixa o CI, facilitando a substituição.",
         'smd': "Componentes SMD economizam muito espaço na placa, mas requerem pinças e um bom ferro de solda ou estação de ar quente.",
         'sot23': "O encapsulamento SOT-23 é comum para Transistores e MOSFETs pequenos. Cuidado com a orientação dos pinos (Gate, Drain, Source).",
         'to220': "O TO-220 dissipa muito calor! Deixe espaço em volta para um dissipador de alumínio, se necessário.",
         'sop': "SOP e SOIC são versões SMD de CIs comuns. O pino 1 é geralmente indicado por um ponto ou chanfro no corpo do CI.",
         'qfp': "Encapsulamentos QFP têm pinos nos 4 lados. Soldar isso à mão requer fluxo de solda e técnica de 'drag soldering'.",
         'pinheader': "Barras de pinos (Pin Headers) são a melhor forma de conectar módulos como displays, sensores ou até programadores externos.",
         'bga': "Componentes BGA têm as esferas de solda em baixo. Impossível soldar à mão sem equipamento especializado e raio-X para inspeção!",
         'usb_c': "Conectores USB-C têm muitos pinos apertados. O roteamento dos sinais diferenciais (D+ e D-) deve ser feito com trilhas paralelas (differential pairs).",
         'micro_usb': "Pads do Micro USB costumam arrancar com força mecânica. Reforce a solda dos 4 furos de ancoragem grandes.",
         'ldr_smd': "Atenção: A luz precisa chegar ao LDR! Não posicione componentes altos em volta que possam criar sombra.",
         'ntc_smd': "Se o NTC for usado para medir a temperatura de um CI, coloque-o no PCB o mais próximo possível do CI alvo.",
         'crystal': "Cristais osciladores devem ficar o mais próximo possível dos pinos do microcontrolador para evitar ruídos e variação de frequência.",
         'silkscreen_text': "Silkscreen é a tinta branca. Use-a para marcar a polaridade (+/-), nome dos pinos e o nome do seu projeto!",
       };
       newTip = pcbTips[componentType] || "Dica de Layout: Mantenha os componentes que se conectam entre si próximos uns dos outros para evitar trilhas longas e embaraçadas.";
    } else {
       const schTips: Record<string, string> = {
         'arduino_uno': "O Arduino UNO é o cérebro! No simulador, ligue LEDs e Sensores nele. Use os pinos GND e 5V para alimentar o seu circuito.",
         'led': "O LED precisa de direção (+ para o Anodo, - para o Catodo) e NUNCA deve ser ligado sem um resistor (ex: 220Ω a 330Ω) para evitar queimar.",
         'resistor': "O Resistor limita a corrente. Quanto maior o valor (Ohms), menos energia passa. Cores diferentes representam valores diferentes.",
         'capacitor': "O Capacitor de cerâmica guarda pequenas quantidades de energia e filtra ruídos. Não tem polaridade (+/-), ligue de qualquer lado.",
         'capacitor_elec': "Capacitores Eletrolíticos armazenam mais energia. TÊM POLARIDADE: o pino longo ou marca positiva vai no + da fonte.",
         'ic': "Circuitos Integrados (CIs) são chips com funções específicas. Veja o datasheet para saber onde ligar VCC (energia) e GND.",
         'ground': "Ground (GND) ou Terra é o ponto de referência 0V. Todos os caminhos de retorno da energia devem ir para o GND.",
         'transistor': "Transistor NPN (BJT): Uma pequena corrente na Base (meio) permite uma corrente maior fluir do Coletor para o Emissor. Funciona como chave eletrônica.",
         'transistor_pnp': "Transistor PNP: A energia flui do Emissor para o Coletor, e ele é ativado quando aplicamos GND na Base. O oposto do NPN.",
         'inductor': "O Indutor (Bobina) armazena energia em campo magnético. É muito usado com capacitores para criar filtros ou em conversores de tensão.",
         'diode': "O Diodo é uma válvula de via única! A corrente só flui do Anodo para o Catodo (lado com a faixa). Útil para proteger contra polaridade reversa.",
         'battery': "Fonte de energia portátil. Cuidado: ligar o Vermelho (+) diretamente no Preto (-) causará um curto-circuito perigoso!",
         'switch': "Interruptor básico. Interrompe ou liga a passagem de corrente. Pode ser usado no VCC ou no GND para ligar o circuito.",
         'lamp': "Lâmpada incandescente. Fica brilhante, mas consome muito mais corrente que um LED e esquenta bastante.",
         'powersupply': "Fonte de alimentação de bancada. Ajuste a tensão (V) e limite a corrente (A) para testar os seus projetos com segurança.",
         'esp32': "O ESP32 é incrivelmente poderoso, tem Wi-Fi e Bluetooth nativos! Funciona a 3.3V, cuidado para não colocar 5V nos pinos de dados.",
         'esp32s3': "O ESP32-S3 é uma versão aprimorada do ESP32 com suporte a instruções vetoriais para IA, mais pinos GPIO e USB OTG nativo.",
         'esp32_cam': "Uma versão do ESP32 com conector para câmera. Requer muita corrente (use fonte boa) e tem poucos pinos disponíveis para uso geral.",
         'raspberry_pi': "O Raspberry Pi é um microcomputador completo! Roda Linux. Evite ligar componentes de alto consumo diretamente nos pinos dele.",
         'buzzer': "O Buzzer Ativo apita apenas ligando a energia. O Buzzer Passivo precisa de um sinal PWM (ondas) do Arduino para criar notas musicais.",
         'relay': "O Relé é um interruptor mecânico ativado eletricamente. Permite que o Arduino (5V) ligue uma lâmpada grande ou motor.",
         'potentiometer': "Um Resistor Variável! Rode o botão para mudar a resistência. Ligue as pontas ao VCC/GND e o pino central a um pino Analógico (ex: A0 do Arduino).",
         'oled': "Displays OLED comunicam por I2C (pinos SDA e SCL). O Arduino envia imagens ou texto usando apenas 4 fios (VCC, GND, SDA, SCL).",
         'motor': "Motores DC requerem correntes altas e criam ruído elétrico. Use um Transistor ou Ponte H (L298N) para controlá-lo a partir do Arduino.",
         'servo_motor': "O Servo Motor vai para um ângulo exato (0 a 180 graus). Tem 3 fios: VCC, GND e Sinal (ligado a um pino PWM do Arduino).",
         'attiny85': "O irmão mais novo do Arduino. Tem apenas 8 pinos, mas é perfeito para projetos minúsculos e definitivos para poupar dinheiro e espaço.",
         'stm32_bluepill': "Uma placa baseada em ARM Cortex-M3 de 32 bits, mais rápida que o Arduino e com mais resolução analógica. Funciona a 3.3V.",
         'mosfet': "O MOSFET canal-N atua como uma chave extremamente eficiente para cargas pesadas. Ele é ativado pela tensão no Gate, não pela corrente.",
         'mosfet_p': "O MOSFET canal-P atua na linha de VCC (high-side switching). Ele liga a carga quando conectamos o Gate ao GND.",
         'timer555': "O clássico CI 555. Pode piscar LEDs, criar sons ou gerar temporizações baseadas em cálculos com resistores e capacitores externos.",
         'opamp': "O Amplificador Operacional pega num sinal analógico fraco e amplifica-o (multiplica), ou pode comparar qual de dois sinais é mais forte.",
         'logic_gate': "Portas lógicas realizam operações matemáticas binárias. Verifique qual função (AND, OR, NOT) esta porta específica executa.",
         'logic_and': "Porta AND (E): A saída só é ligada (High) se TODAS as entradas também estiverem ligadas.",
         'logic_or': "Porta OR (OU): A saída liga se PELO MENOS UMA das entradas estiver ligada.",
         'logic_nand': "Porta NAND: É o oposto da AND. A saída desliga apenas se TODAS as entradas estiverem ligadas.",
         'logic_nor': "Porta NOR: O oposto da OR. A saída só liga se NENHUMA entrada estiver ligada.",
         'logic_xor': "Porta XOR (OU Exclusivo): A saída liga se as entradas forem DIFERENTES entre si.",
         'ac_source': "Fonte de Tensão Alternada (AC). Como a tomada da parede. A corrente muda de direção constantemente em forma de onda.",
         'voltmeter': "O Voltímetro mede a Tensão (Volts). Para medir, ele deve ser ligado em PARALELO ao componente que você quer investigar.",
         'ammeter': "O Amperímetro mede a Corrente (Amperes). Ele deve ser ligado em SÉRIE, ou seja, corte o fio e faça a energia passar por dentro dele.",
         'oscilloscope': "O Osciloscópio mostra um gráfico da energia elétrica ao longo do tempo. Essencial para ver a comunicação I2C, SPI ou ondas PWM.",
         'seven_segment': "Display de 7 Segmentos possui 7 ou 8 LEDs dentro. Ligue cada pino através de um resistor. Pode ser Cátodo Comum ou Ânodo Comum.",
         'protoboard': "A Protoboard é onde testa o circuito sem soldar. As linhas laterais ligam na horizontal e as centrais ligam na vertical (em grupos de 5).",
         'usb_c': "O conector USB-C entrega 5V, e os pinos CC1 e CC2 precisam de resistores de 5.1kΩ aterrados para dispositivos pedirem energia ao PC.",
         'micro_usb': "Usado para energia (5V e GND) e dados (D+ e D-). Comum em placas antigas, sendo substituído pelo USB-C.",
         'cr2032': "Bateria tipo botão (Moeda) de 3V. Perfeita para relógios RTC e controles remotos. Capacidade limitada de energia.",
         'ldr': "LDR (Light Dependent Resistor): Um sensor de luz. No escuro, a resistência é alta. Na luz, a resistência diminui e deixa passar mais energia.",
         'ntc': "Termistor NTC: Um sensor de temperatura simples. Quanto mais quente fica, mais a sua resistência cai. Costuma ser usado com um Divisor de Tensão.",
         'crystal': "Oscilador a Cristal. Gera o pulso de 'clock' preciso (o batimento cardíaco) para os microcontroladores executarem instruções no tempo certo.",
         'ultrasonic': "Sensor Ultrassônico (HC-SR04): Emite um som e escuta o eco. Sabendo a velocidade do som e o tempo do eco, calcula a distância dos objetos.",
         'hc05': "Módulo Bluetooth HC-05 (Classic). O pino RX opera a 3.3V! Use um divisor de tensão do TX de 5V do Arduino para não queimar o RX do Bluetooth.",
         'dht11': "Sensor de Temperatura e Umidade. Fácil de usar, com um único pino de dados, mas não é extremamente rápido nem o mais preciso.",
         'stepper_motor': "Motor de Passo. Move-se 'passo a passo' com precisão absoluta (ex: impressoras 3D). Exige um Driver (ex: A4988) para enviar os pulsos certos.",
         'motor_driver': "Driver L298N ou Ponte H. Consegue inverter a polaridade para um motor girar para os dois lados, alimentando o motor com bateria externa.",
         'esp8266': "A primeira revolução do Wi-Fi IoT barato (ex: NodeMCU). Trabalha a 3.3V. Usa comandos AT ou programação nativa como no Arduino.",
         'gas_sensor': "Sensores MQ (ex: MQ-2, MQ-3). Precisam aquecer uma resistência interna e consomem muita corrente. Evite ligar no pino 5V do Arduino por longos períodos.",
         'accelerometer': "Acelerômetro (ex: MPU6050). Mede a gravidade (G-force) e inclinação em 3 eixos (X, Y, Z). Comunicação feita via I2C (SDA e SCL).",
         'gps': "Módulo GPS (ex: NEO-6M). Precisa de céu aberto (linha de visão para satélites). Recebe os dados brutos de localização via porta Serial (TX/RX).",
       };
       newTip = schTips[componentType] || "Tudo em eletrónica precisa de um circuito fechado: a energia sai do positivo, passa pelo componente e regressa pelo terra (GND).";
    }
    }

    setTip(newTip);
    setTypingIndex(0);
  }, [componentType, mode, tutorialId]);

  React.useEffect(() => {
    if (typingIndex < tip.length) {
      const timeout = setTimeout(() => {
        setTypingIndex(prev => prev + 1);
      }, 10); // slightly faster for long texts
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, tip]);

  if (!tip) return null;

  return (
    <div className="mb-4 p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg relative overflow-hidden shadow-inner">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
      <h4 className="text-[11px] font-bold text-indigo-400 mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        Assistente IA Educativo
      </h4>
      <p className="text-[10px] text-gray-300 leading-relaxed min-h-[30px] font-medium">
        {tip.substring(0, typingIndex)}
        {typingIndex < tip.length && <span className="inline-block w-1.5 h-3 bg-indigo-400 animate-pulse ml-0.5 align-middle"></span>}
      </p>
    </div>
  );
}

export function PropertiesPanel() {
  const { mode, elements, pcbElements, selectedIds, updateElement, updateElements, userMode, activeTutorialId } =
    useEditor();

  const activeElements = mode === "schematic" ? elements : pcbElements;
  const selectedElement = activeElements.find((el) => el.id === selectedIds[0]);

  if (!selectedElement) {
    return (
      <div className="w-64 h-full shrink-0 bg-[#16161a] md:border-r border-[#2d2d33] flex flex-col shadow-xl z-20">
        <div className="h-10 border-b border-[#2d2d33] flex items-center px-4">
          <span className="text-xs font-medium text-gray-400">
            PROPRIEDADES
          </span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto p-4 custom-scrollbar">
          {userMode === 'beginner' && activeTutorialId && (
            <AIAssistantTip mode={mode} tutorialId={activeTutorialId} />
          )}
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 mt-10">
            <Settings2 className="w-8 h-8 mb-3 opacity-20" />
            <span className="text-sm">Nenhum elemento selecionado</span>
            <span className="text-[10px] mt-2 opacity-60">
              Selecione um componente para editar suas propriedades
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isSchemaComponent = selectedElement.type === "component";
    const isPcbComponent = selectedElement.type === "pcb_component";
  
  const handleTransformChange = (comp, updates) => {
    if (mode === "pcb" && comp.type === "pcb_component" && comp.componentType !== "pad") {
       const updatesArray = [{ id: comp.id, updates }];
       const newX = updates.x !== undefined ? updates.x : comp.x;
       const newY = updates.y !== undefined ? updates.y : comp.y;
       const newRot = updates.rotation !== undefined ? updates.rotation : comp.rotation;
       
       const oldX = comp.x;
       const oldY = comp.y;
       const oldRot = comp.rotation || 0;
       
       const deltaRot = newRot - oldRot;
       const rad = deltaRot * (Math.PI / 180);
       const cos = Math.cos(rad);
       const sin = Math.sin(rad);

       pcbElements.forEach(p => {
          if (p.type === "pcb_component" && p.customProps?.parentId === comp.id) {
             const px = p.x - oldX;
             const py = p.y - oldY;
             const rotatedPx = px * cos - py * sin;
             const rotatedPy = px * sin + py * cos;
             
             const dx = newX - oldX;
             const dy = newY - oldY;
             
             updatesArray.push({ id: p.id, updates: { x: oldX + rotatedPx + dx, y: oldY + rotatedPy + dy } });
          }
       });
       updateElements(updatesArray);
    } else {
       updateElement(comp.id, updates);
    }
  };
  const isBoard = selectedElement.type === "board";
  const isComponent = isSchemaComponent || isPcbComponent;

  const comp = selectedElement as ComponentEntity | PcbComponentEntity;

  const getTypeName = (el: AnyElement) => {
    if (el.type === "component") return el.componentType.replace("_", " ");
    if (el.type === "pcb_component") return el.componentType.replace("_", " ");
    if (el.type === "trace") return "Trilha (Track)";
    if (el.type === "board") return "Placa (Board)";
    return "Fio (Wire)";
  };

  return (
    <div className="w-64 h-full shrink-0 bg-[#16161a] md:border-r border-[#2d2d33] flex flex-col shadow-xl z-20">
      <div className="h-10 border-b border-[#2d2d33] flex items-center px-4 bg-[#1a1a1f]">
        <span className="text-xs font-medium text-gray-200">INSPECTOR</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {userMode === 'beginner' && (isComponent || activeTutorialId) && (
          <AIAssistantTip componentType={isComponent ? (comp as ComponentEntity).componentType : undefined} mode={mode} tutorialId={activeTutorialId} />
        )}
        <Section title="Geral" icon={AlignLeft}>
          <PropertyRow label="Tipo">
            <span className="text-xs text-blue-400 capitalize bg-blue-400/10 px-2 py-0.5 rounded font-medium">
              {getTypeName(selectedElement)}
            </span>
          </PropertyRow>

          {isComponent && (
            <PropertyRow label="Name">
              <Input
                value={comp.name}
                onChange={(e: any) =>
                  updateElement(comp.id, { name: e.target.value })
                }
              />
            </PropertyRow>
          )}
        </Section>

        {isComponent && userMode === 'pro' && (
          <Section title="Posição / Transformação" icon={Crosshair}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">
                  X (mm)
                </label>
                <Input
                  type="number"
                  value={comp.x}
                  onChange={(e: any) =>
                    handleTransformChange(comp, { x: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">
                  Y (mm)
                </label>
                <Input
                  type="number"
                  value={comp.y}
                  onChange={(e: any) =>
                    handleTransformChange(comp, { y: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <PropertyRow label="Rotação">
              <div className="flex bg-[#0f0f13] rounded border border-[#2d2d33] overflow-hidden focus-within:border-blue-500 transition-colors w-full">
                <input
                  type="number"
                  value={comp.rotation}
                  onChange={(e) =>
                    handleTransformChange(comp, { rotation: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-transparent px-2 py-1 outline-none text-white text-xs font-mono text-right"
                />
                <button
                  onClick={() =>
                    handleTransformChange(comp, { rotation: (comp.rotation + 90) % 360 })
                  }
                  className="px-2 bg-[#2d2d33] hover:bg-gray-600 transition text-gray-300 border-l border-[#2d2d33] flex items-center justify-center"
                  title="Rotacionar 90°"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>
            </PropertyRow>
          </Section>
        )}

        {(isPcbComponent || selectedElement.type === "trace") && (
          <Section title="Camada Física" icon={Layers}>
            <PropertyRow label="Layer">
              <div className="flex bg-[#0f0f13] p-0.5 rounded border border-[#2d2d33] w-full">
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, { layer: "top" })
                  }
                  className={cn(
                    "flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors tracking-wider",
                    (selectedElement as any).layer === "top"
                      ? "bg-red-500 text-white"
                      : "text-gray-500 hover:text-gray-300 hover:bg-[#2d2d33]",
                  )}
                >
                  Top
                </button>
                <button
                  onClick={() =>
                    updateElement(selectedElement.id, { layer: "bottom" })
                  }
                  className={cn(
                    "flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors tracking-wider",
                    (selectedElement as any).layer === "bottom"
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:text-gray-300 hover:bg-[#2d2d33]",
                  )}
                >
                  Bottom
                </button>
              </div>
            </PropertyRow>
          </Section>
        )}

        {["arduino_uno", "esp32", "esp32s3", "esp32_cam", "raspberry_pi", "attiny85", "stm32_bluepill", "esp8266"].includes(
          (comp as ComponentEntity).componentType,
        ) && (
          <McuCodeEditor comp={comp as ComponentEntity} updateElement={updateElement} />
        )}

        {isPcbComponent && (comp as PcbComponentEntity).componentType === "silkscreen_text" && (
          <Section title="Parâmetros" icon={Zap}>
            <PropertyRow label="Texto">
              <Input
                value={comp.customProps?.text || "TEXT"}
                onChange={(e: any) =>
                  updateElement(comp.id, {
                    customProps: {
                      ...comp.customProps,
                      text: e.target.value
                    }
                  })
                }
              />
            </PropertyRow>
          </Section>
        )}

        {isSchemaComponent &&
          (comp as ComponentEntity).componentType !== "ground" && (
            <Section title="Parâmetros" icon={Zap}>
              <PropertyRow
                label={
                  ["powersupply", "battery", "ac_source", "lamp"].includes(
                    (comp as ComponentEntity).componentType,
                  )
                    ? "Tensão"
                    : "Valor"
                }
              >
                <ValueUnitInput
                  value={(comp as ComponentEntity).value || ""}
                  componentType={(comp as ComponentEntity).componentType}
                  onChange={(val: string) =>
                    updateElement(comp.id, { value: val })
                  }
                />
              </PropertyRow>

              {userMode === 'pro' && ["powersupply", "battery", "ac_source"].includes(
                (comp as ComponentEntity).componentType,
              ) && (
                <PropertyRow label="Corrente Max.">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={
                      (comp as ComponentEntity).customProps?.currentLimit ?? 2
                    }
                    onChange={(e: any) =>
                      updateElement(comp.id, {
                        customProps: {
                          ...(comp as ComponentEntity).customProps,
                          currentLimit: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </PropertyRow>
              )}

              {(comp as ComponentEntity).componentType === "lamp" && (
                <PropertyRow label="Tensão de Queima">
                  <Input
                    type="text"
                    value={
                      (comp as ComponentEntity).customProps?.burnoutVoltage ?? "264V"
                    }
                    onChange={(e: any) =>
                      updateElement(comp.id, {
                        customProps: {
                          ...(comp as ComponentEntity).customProps,
                          burnoutVoltage: e.target.value,
                        },
                      })
                    }
                  />
                </PropertyRow>
              )}

              {userMode === 'pro' && (comp as ComponentEntity).componentType === "resistor" && (
                <PropertyRow label="Potência Máx. (W)">
                  <select
                    value={
                      (
                        comp as ComponentEntity
                      ).customProps?.maxPower?.toString() || "0.25"
                    }
                    onChange={(e: any) =>
                      updateElement(comp.id, {
                        customProps: {
                          ...(comp as ComponentEntity).customProps,
                          maxPower: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="bg-[#0f0f13] border border-[#2d2d33] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 w-full"
                  >
                    <option value="0.125">1/8 W (0.125W)</option>
                    <option value="0.25">1/4 W (0.25W)</option>
                    <option value="0.5">1/2 W (0.5W)</option>
                    <option value="1">1 W</option>
                    <option value="3">3 W</option>
                    <option value="5">5 W</option>
                    <option value="10">10 W</option>
                  </select>
                </PropertyRow>
              )}

              {userMode === 'pro' && ["transistor", "transistor_pnp", "mosfet", "mosfet_p", "ic"].includes((comp as ComponentEntity).componentType) && (
                <PropertyRow label="Referência / Modelo">
                  <Input
                    value={(comp as ComponentEntity).value || ""}
                    onChange={(val) => updateElement(comp.id, { value: val })}
                    placeholder="e.g. 2N3904, IRFZ44N"
                  />
                </PropertyRow>
              )}

              {["ldr", "ntc", "gas_sensor"].includes((comp as ComponentEntity).componentType) && (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{(comp as ComponentEntity).componentType === "ldr" ? "Luminosidade" : (comp as ComponentEntity).componentType === "ntc" ? "Temperatura" : "Nível de Gás"}</span>
                    <span className="text-teal-400 font-mono">
                      {(comp as ComponentEntity).customProps?.envValue ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(comp as ComponentEntity).customProps?.envValue ?? 50}
                    onChange={(e: any) =>
                      updateElement(comp.id, {
                        customProps: {
                          ...(comp as ComponentEntity).customProps,
                          envValue: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full h-1 bg-[#2d2d33] rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}
              {(comp as ComponentEntity).componentType === "potentiometer" && (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Ajuste Real</span>
                    <span className="text-teal-400 font-mono">
                      {(comp as ComponentEntity).customProps?.setting ?? 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(comp as ComponentEntity).customProps?.setting ?? 50}
                    onChange={(e) =>
                      updateElement(comp.id, {
                        customProps: {
                          ...(comp as ComponentEntity).customProps,
                          setting: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full accent-teal-500 h-1.5 bg-[#2d2d33] rounded-lg appearance-none"
                  />
                </div>
              )}
              
              {(comp as ComponentEntity).componentType === "digital_multimeter" && (
                <>
                  <PropertyRow label="Modo">
                    <select
                      className="w-full bg-[#1e1e24] text-xs text-gray-300 rounded border border-[#2d2d33] px-2 py-1 outline-none focus:border-blue-500"
                      value={(comp as ComponentEntity).customProps?.dmmMode || "DCV"}
                      onChange={(e) =>
                        updateElement(comp.id, {
                          customProps: {
                            ...(comp as ComponentEntity).customProps,
                            dmmMode: e.target.value,
                            dmmScale: (e.target.value === "DCV") ? "20" : (e.target.value === "DCA" ? "200m" : "20k")
                          },
                        })
                      }
                    >
                      <option value="DCV">Tensão Contínua (DCV)</option>
                      <option value="ACV">Tensão Alternada (ACV)</option>
                      <option value="DCA">Corrente Contínua (DCA)</option>
                      <option value="RES">Resistência (Ω)</option>
                    </select>
                  </PropertyRow>
                  <PropertyRow label="Escala">
                    <select
                      className="w-full bg-[#1e1e24] text-xs text-gray-300 rounded border border-[#2d2d33] px-2 py-1 outline-none focus:border-blue-500"
                      value={(comp as ComponentEntity).customProps?.dmmScale || "20"}
                      onChange={(e) =>
                        updateElement(comp.id, {
                          customProps: {
                            ...(comp as ComponentEntity).customProps,
                            dmmScale: e.target.value,
                          },
                        })
                      }
                    >
                      {((comp as ComponentEntity).customProps?.dmmMode || "DCV") === "DCV" && (
                        <>
                          <option value="200m">200mV</option>
                          <option value="2">2V</option>
                          <option value="20">20V</option>
                          <option value="200">200V</option>
                          <option value="1000">1000V</option>
                        </>
                      )}
                      {((comp as ComponentEntity).customProps?.dmmMode) === "ACV" && (
                        <>
                          <option value="200">200V</option>
                          <option value="750">750V</option>
                        </>
                      )}
                      {((comp as ComponentEntity).customProps?.dmmMode) === "DCA" && (
                        <>
                          <option value="2m">2mA</option>
                          <option value="20m">20mA</option>
                          <option value="200m">200mA</option>
                          <option value="10A">10A</option>
                        </>
                      )}
                      {((comp as ComponentEntity).customProps?.dmmMode) === "RES" && (
                        <>
                          <option value="200">200 Ω</option>
                          <option value="2k">2 kΩ</option>
                          <option value="20k">20 kΩ</option>
                          <option value="200k">200 kΩ</option>
                          <option value="2M">2 MΩ</option>
                          <option value="20M">20 MΩ</option>
                        </>
                      )}
                    </select>
                  </PropertyRow>
                </>
              )}

              {(comp as ComponentEntity).componentType === "oscilloscope" && (
                <div className="space-y-2 mt-2">
                  <PropertyRow label="Escala (V/div)">
                    <Input
                      type="number"
                      value={(comp as ComponentEntity).customProps?.scale ?? 20}
                      onChange={(val) =>
                        updateElement(comp.id, {
                          customProps: {
                            ...(comp as ComponentEntity).customProps,
                            scale: parseFloat(val) || 20,
                          },
                        })
                      }
                      placeholder="e.g. 20"
                    />
                  </PropertyRow>
                </div>
              )}

              {(comp as ComponentEntity).componentType === "led" && (
                <PropertyRow label="Cor do LED">
                  <select
                    className="w-full bg-[#1e1e24] text-xs text-gray-300 rounded border border-[#2d2d33] px-2 py-1 outline-none focus:border-blue-500"
                    value={(comp as ComponentEntity).customProps?.color || "red"}
                    onChange={(e) =>
                      updateElement(comp.id, {
                        customProps: {
                          ...(comp as ComponentEntity).customProps,
                          color: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="red">Vermelho (1.8V)</option>
                    <option value="green">Verde (2.2V)</option>
                    <option value="blue">Azul (3.0V)</option>
                    <option value="yellow">Amarelo (2.1V)</option>
                    <option value="white">Branco (3.0V)</option>
                  </select>
                </PropertyRow>
              )}
            </Section>
          )}

        {["wire", "trace"].includes(selectedElement.type) && (
          <Section
            title="Propriedades de Linha"
            icon={AlignVerticalSpaceAround}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Espessura (Largura)</span>
                <span className="font-mono text-gray-300">
                  {(selectedElement as any).width ||
                    (selectedElement.type === "trace" ? 4 : 2)}{" "}
                  px
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={
                  (selectedElement as any).width ||
                  (selectedElement.type === "trace" ? 4 : 2)
                }
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    width: parseInt(e.target.value) || 2,
                  })
                }
                className="w-full accent-blue-500 h-1.5 bg-[#2d2d33] rounded-lg appearance-none"
              />
            </div>
          </Section>
        )}

        {isBoard && (
          <Section title="Dimensões da Placa" icon={Scale3d}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">
                  Largura (mm)
                </label>
                <Input
                  type="number"
                  value={(selectedElement as any).width}
                  onChange={(e: any) =>
                    updateElement(selectedElement.id, {
                      width: parseInt(e.target.value) || 100,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">
                  Altura (mm)
                </label>
                <Input
                  type="number"
                  value={(selectedElement as any).height}
                  onChange={(e: any) =>
                    updateElement(selectedElement.id, {
                      height: parseInt(e.target.value) || 100,
                    })
                  }
                />
              </div>
            </div>
            <PropertyRow label="Formato da Placa">
              <select
                className="w-full bg-[#1e1e24] text-xs text-gray-300 p-1.5 rounded border border-[#2d2d33] focus:border-blue-500 focus:outline-none"
                value={(selectedElement as any).boardShape || "rect"}
                onChange={(e) =>
                  updateElement(selectedElement.id, { boardShape: e.target.value as any })
                }
              >
                <option value="rect">Retângulo / Quadrado</option>
                <option value="circle">Círculo</option>
                <option value="triangle">Triângulo</option>
                {/* Manual form drawing could be added later, currently handled as "custom" */}
              </select>
            </PropertyRow>
            <PropertyRow label="Cor da Placa (Solder Mask)">
              <select
                className="w-full bg-[#1e1e24] text-xs text-gray-300 p-1.5 rounded border border-[#2d2d33] focus:border-blue-500 focus:outline-none"
                value={(selectedElement as any).boardColor || "green"}
                onChange={(e) =>
                  updateElement(selectedElement.id, { boardColor: e.target.value })
                }
              >
                <option value="green">Verde Clássico</option>
                <option value="red">Vermelho</option>
                <option value="blue">Azul</option>
                <option value="black">Preto Fosco</option>
                <option value="white">Branco</option>
                <option value="purple">Roxo (OSH Park)</option>
              </select>
            </PropertyRow>
            <PropertyRow label="Cor das Trilhas">
              <select
                className="w-full bg-[#1e1e24] text-xs text-gray-300 p-1.5 rounded border border-[#2d2d33] focus:border-blue-500 focus:outline-none"
                value={(selectedElement as any).traceColor || "silver"}
                onChange={(e) =>
                  updateElement(selectedElement.id, { traceColor: e.target.value })
                }
              >
                <option value="silver">HASL / ENIG (Prata/Ouro)</option>
                <option value="copper">Cobre Nu</option>
                <option value="gold">Ouro (ENIG)</option>
              </select>
            </PropertyRow>
            <PropertyRow label="Camadas">
              <Input
                type="number"
                step="2"
                min="2"
                max="16"
                value={(selectedElement as any).customProps?.layers || 2}
                onChange={(e: any) =>
                  updateElement(selectedElement.id, {
                    customProps: {
                      ...(selectedElement as any).customProps,
                      layers: parseInt(e.target.value) || 2,
                    },
                  })
                }
              />
            </PropertyRow>
          </Section>
        )}
      </div>
    </div>
  );
}
