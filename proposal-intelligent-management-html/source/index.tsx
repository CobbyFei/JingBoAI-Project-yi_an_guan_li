Exit code: 0
Wall time: 0.3 seconds
Total output lines: 2835
Output:
/** @name 璁鏅鸿兘绠＄悊 */
import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  CircleAlert,
  Check,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileCog,
  FileText,
  Grid2X2,
  History,
  LayoutList,
  Lightbulb,
  LockKeyhole,
  MessageSquareMore,
  NotebookTabs,
  PenLine,
  Plus,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Vote,
  X,
} from "lucide-react";
import { defineHashPageRoute, useHashPage } from "../../common/useHashPage";
import "./proposal.css";
import "./execution-review.css";

const route = defineHashPageRoute(
  [
    { id: "my-proposals", title: "鎴戠殑璁" },
    { id: "lifecycle", title: "璁鐢熷懡鍛ㄦ湡" },
    { id: "organize-submit", title: "璁鏁寸悊涓庨瀹? },
    { id: "review-tracking", title: "瀹℃牳娴佺▼杩借釜" },
    { id: "meeting-materials", title: "璁細娴佺▼绠＄悊" },
    { id: "task-breakdown", title: "浠诲姟鎷嗚В涓庡垎閰? },
    { id: "execution-tracking", title: "璁鎵ц杩借釜" },
    { id: "pre-review", title: "棰勫鏍稿垪琛? },
    { id: "audit-list", title: "瀹℃牳鍒楄〃" },
    { id: "skills", title: "鎶€鑳藉畾涔? },
    { id: "templates", title: "妯℃澘绠＄悊" },
    { id: "permissions", title: "鏉冮檺绠＄悊" },
  ],
  { defaultPageId: "my-proposals" },
);

type Stage =
  | "received"
  | "functional"
  | "prepassed"
  | "audit"
  | "auditpassed"
  | "voting"
  | "votepassed"
  | "votefailed"
  | "returned";
type Proposal = {
  id: string;
  title: string;
  source: string;
  applicant: string;
  department: string;
  time: string;
  stage: Stage;
  status: string;
  reason?: string;
  revised?: boolean;
  attachments: string[];
  templateName?: string;
  templateVersion?: string;
  lifecycleStatus?: string;
  changeTime?: string;
  rejectionHistory?: { person: string; role: string; time: string; opinion: string; changes: string }[];
  taskStatus?: string;
  taskNodes?: TaskNode[];
  executionStatus?: "鎵ц涓? | "寰呭鏍? | "椹冲洖淇敼" | "宸插畬鎴? | "宸插綊妗?;
  executionRevision?: { reviewer: string; time: string; opinion: string; changes: string };
};
type TaskNode = {
  name: string;
  department: string;
  owner: string;
  proofRequired: boolean;
  deadline: string;
};
const original: Proposal[] = [
  {
    id: "PA-2026-0086",
    title: "2026骞存妧鏀规姇璧勯」鐩皟鏁磋妗?,
    source: "鍗撹秺娴佺▼",
    applicant: "鐜嬬",
    department: "鐢熶骇鎶€鏈儴",
    time: "浠婂ぉ 09:28",
    stage: "received",
    status: "寰呮暣鐞?,
    templateName: "椤圭洰鎶曡祫绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "寰呮暣鐞?,
    changeTime: "浠婂ぉ 09:28",
    attachments: ["鎶€鏀规姇璧勭敵璇疯〃.xlsx", "椤圭洰鍙爺鎶ュ憡.pdf", "娴嬬畻鏄庣粏.xlsx"],
  },
  {
    id: "PA-2026-0081",
    title: "鍔炲叕鍥尯缁煎悎鑳芥簮鏈嶅姟鍚堜綔璁",
    source: "閽夐拤鎻愪氦",
    applicant: "鏉庢櫒",
    department: "琛屾斂绠＄悊閮?,
    time: "浠婂ぉ 08:42",
    stage: "functional",
    status: "寰呴瀹?,
    templateName: "缁忚惀鍐崇瓥绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "鑱岃兘棰勫",
    changeTime: "浠婂ぉ 10:06",
    attachments: ["璁鐢宠琛?docx", "鍚堜綔鏂规柟妗?pdf"],
  },
  {
    id: "PA-2026-0079",
    title: "闂茬疆璧勪骇澶勭疆鏂规璁",
    source: "闂ㄦ埛鎻愪氦",
    applicant: "鐜嬫シ鐓?,
    department: "璧勪骇绠＄悊閮?,
    time: "鏄ㄥぉ 16:10",
    stage: "returned",
    status: "椹冲洖淇敼",
    templateName: "缁忚惀鍐崇瓥绫昏妗堟ā鏉?,
    templateVersion: "V2.0",
    lifecycleStatus: "椹冲洖淇敼",
    changeTime: "鏄ㄥぉ 16:10",
    rejectionHistory: [{ person: "鏉庢櫒", role: "鑱岃兘棰勫浜?, time: "2026-08-11 15:42", opinion: "璇疯ˉ鍏呰祫浜ц瘎浼版姤鍛婏紝骞舵槑纭缃敹鐩婃祴绠楀彛寰勩€?, changes: "鐢宠浜哄凡涓婁紶璧勪骇璇勪及鎶ュ憡.pdf锛屽缃柟寮忕敱鈥滃叕寮€鎸傜墝鈥濅慨鏀逛负鈥滆瘎浼板悗鍗忚杞鈥濄€? }, { person: "鍛ㄦ晱", role: "璁鏁寸悊涓撳憳", time: "2026-08-10 11:20", opinion: "璁渚濇嵁鏈畬鏁村紩鐢ㄥ缃巿鏉冩竻鍗曘€?, changes: "鐢宠浜鸿ˉ鍏呫€婂浐瀹氳祫浜х鐞嗗姙娉曘€嬪強澶勭疆鎺堟潈娓呭崟銆? }],
    reason: "璇疯ˉ鍏呰祫浜ц瘎浼版姤鍛婏紝骞舵槑纭缃敹鐩婃祴绠楀彛寰勩€?,
    attachments: ["澶勭疆鐢宠琛╛v2.docx", "璧勪骇璇勪及鎶ュ憡.pdf"],
  },
  {
    id: "PA-2026-0074",
    title: "HSE涓撻」闅愭偅娌荤悊璧勯噾浣跨敤璁",
    source: "鍗撹秺娴佺▼",
    applicant: "璧电拠",
    department: "瀹夊叏鐜繚閮?,
    time: "鏄ㄥぉ 14:23",
    stage: "audit",
    status: "寰呰妗堝鏍?,
    templateName: "缁忚惀鍐崇瓥绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "璁瀹℃牳涓?,
    changeTime: "鏄ㄥぉ 14:23",
    attachments: ["涓撻」鐢宠琛?docx", "闅愭偅娌荤悊娓呭崟.xlsx"],
  },
  {
    id: "PA-2026-0072",
    title: "渚涘簲閾惧崗鍚岄檷鏈勾搴︽鏋惰妗?,
    source: "闂ㄦ埛鎻愪氦",
    applicant: "鍛ㄦ晱",
    department: "渚涘簲閾剧鐞嗛儴",
    time: "鏄ㄥぉ 11:06",
    stage: "audit",
    status: "寰呭鏍?,
    templateName: "缁忚惀鍐崇瓥绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "璁瀹℃牳涓?,
    changeTime: "鏄ㄥぉ 11:06",
    attachments: ["骞村害妗嗘灦璁.docx", "闄嶆湰娴嬬畻.xlsx", "渚涘簲鍟嗗垎鏋?pdf"],
  },
  {
    id: "PA-2026-0067",
    title: "搴熸按澶勭悊绯荤粺鍗囩骇鏀归€犺妗?,
    source: "鍗撹秺娴佺▼",
    applicant: "瀛欐旦",
    department: "瀹夊叏鐜繚閮?,
    time: "08-10 16:35",
    stage: "audit",
    status: "椹冲洖淇敼",
    templateName: "椤圭洰鎶曡祫绫昏妗堟ā鏉?,
    templateVersion: "V1.8",
    lifecycleStatus: "椹冲洖淇敼",
    changeTime: "08-10 16:35",
    rejectionHistory: [{ person: "璧电拠", role: "鑱岃兘棰勫浜?, time: "2026-08-10 16:35", opinion: "璇疯ˉ鍏呯幆淇濋獙鏀朵緷鎹紝骞惰鏄庢敼閫犳湡闂寸殑杩炵画鐢熶骇淇濋殰鏂规銆?, changes: "寰呯敵璇蜂汉鍥炰紶淇敼鍐呭銆? }],
    reason: "璇疯ˉ鍏呯幆淇濋獙鏀朵緷鎹紝骞惰鏄庢敼閫犳湡闂寸殑杩炵画鐢熶骇淇濋殰鏂规銆?,
    attachments: ["鍗囩骇鏀归€犵敵璇疯〃.docx", "鐜繚璇勪及鎶ュ憡.pdf"],
  },
  {
    id: "PA-2026-0064",
    title: "鐗╂祦鍥粨鍌ㄨ兘鍔涙彁鍗囪妗?,
    source: "閽夐拤鎻愪氦",
    applicant: "鍒樼晠",
    department: "鐗╂祦绠＄悊閮?,
    time: "08-10 09:18",
    stage: "audit",
    status: "椹冲洖淇敼鍚庡緟瀹℃牳",
    templateName: "椤圭洰鎶曡祫绫昏妗堟ā鏉?,
    templateVersion: "V1.8",
    lifecycleStatus: "鑱岃兘棰勫",
    changeTime: "08-10 09:18",
    reason: "涓婁竴杞姹傝ˉ鍏呮姇璧勫洖鏀舵湡娴嬬畻锛岀敵璇蜂汉宸查噸鏂版彁浜ゆ祴绠楅檮浠躲€?,
    revised: true,
    attachments: [
      "浠撳偍鎻愬崌璁_v2.docx",
      "鎶曡祫鍥炴敹鏈熸祴绠?xlsx",
      "鐗╂祦鏂规.pdf",
    ],
  },
  {
    id: "PA-2026-0060",
    title: "鐮斿彂瀹為獙瀹よ澶囪喘缃妗?,
    source: "闂ㄦ埛鎻愪氦",
    applicant: "璁稿畞",
    department: "鐮斿彂绠＄悊閮?,
    time: "08-09 14:40",
    stage: "audit",
    status: "瀹℃牳涓?,
    templateName: "椤圭洰鎶曡祫绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "璁瀹℃牳涓?,
    changeTime: "08-09 14:40",
    executionRevision: { reviewer: "鍛ㄦ晱", time: "2026-08-12 16:10", opinion: "璇疯ˉ鍏呰澶囬獙鏀剁瀛楅〉锛屽苟璇存槑鍏抽敭璁惧鐨勬姇鐢ㄦ祴璇曠粨璁恒€?, changes: "宸茶ˉ浼犻獙鏀剁瀛楅〉銆佹祴璇曡褰曚笌璁惧杩愯鐓х墖銆? },
    attachments: ["璁惧璐疆鐢宠琛?docx", "璁惧娓呭崟.xlsx", "璇环瀵规瘮琛?pdf"],
  },
  {
    id: "PA-2026-0068",
    title: "楂樼骇绠＄悊浜哄憳鑱樹换浜嬮」璁",
    source: "閽夐拤鎻愪氦",
    applicant: "闄堥",
    department: "浜哄姏璧勬簮閮?,
    time: "08-10 15:40",
    stage: "auditpassed",
    status: "瀹℃牳閫氳繃",
    templateName: "浜轰簨浠诲厤绫昏妗堟ā鏉?,
    templateVersion: "V1.4",
    lifecycleStatus: "寰呮姇绁?,
    changeTime: "08-10 15:40",
    attachments: ["鑱樹换璁.docx", "灞ュ巻鍙婅€冨療鏉愭枡.pdf"],
  },
  {
    id: "PA-2026-0061",
    title: "鐢熶骇瑁呯疆鑺傝兘鎶€鏀逛簨椤硅妗?,
    source: "闂ㄦ埛鎻愪氦",
    applicant: "鐜嬫シ鐓?,
    department: "鐢熶骇鎶€鏈儴",
    time: "08-08 10:12",
    stage: "votefailed",
    status: "鎶曠エ鏈€氳繃",
    templateName: "椤圭洰鎶曡祫绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "瀹℃牳閫氳繃",
    changeTime: "08-08 10:12",
    reason: "鍙備細濮斿憳璁や负鎶曡祫鍥炴敹鏈熻鏄庝笉瓒筹紝寤鸿瀹屽杽鍚庨噸鏂扮敵鎶ャ€?,
    attachments: ["鎶€鏀逛簨椤圭敵璇疯〃.docx", "鑺傝兘璇勪及.pdf"],
  },
  {
    id: "PA-2026-0056",
    title: "鏁板瓧鍖栧钩鍙板缓璁句簩鏈熻妗?,
    source: "鍗撹秺娴佺▼",
    applicant: "鐜嬫シ鐓?,
    department: "淇℃伅绠＄悊閮?,
    time: "08-06 13:20",
    stage: "votepassed",
    status: "鎶曠エ閫氳繃",
    templateName: "椤圭洰鎶曡祫绫昏妗堟ā鏉?,
    templateVersion: "V2.1",
    lifecycleStatus: "鐫ｅ姙涓?,
    changeTime: "08-06 13:20",
    attachments: ["绔嬮」鐢宠琛?docx", "棰勭畻娴嬬畻.xlsx"],
  },
];
const menu = [
  ["my-proposals", "鎴戠殑璁", ClipboardList],
  ["lifecycle", "璁鐢熷懡鍛ㄦ湡", LayoutList],
  ["organize-submit", "璁鏁寸悊涓庨瀹?, FileCheck2],
  ["review-tracking", "瀹℃牳娴佺▼杩借釜", ClipboardList],
  ["meeting-materials", "璁細娴佺▼绠＄悊", Vote],
  ["task-breakdown", "浠诲姟鎷嗚В涓庡垎閰?, ClipboardList],
  ["execution-tracking", "璁鎵ц杩借釜", ClipboardList],
  ["pre-review", "棰勫鏍稿垪琛?, FileCheck2],
  ["audit-list", "瀹℃牳鍒楄〃", ShieldCheck],
  ["skills", "鎶€鑳藉畾涔?, Sparkles],
  ["templates", "妯℃澘绠＄悊", FileCog],
  ["permissions", "鏉冮檺绠＄悊", LockKeyhole],
] as const;
const userMenu = menu.filter(([id]) =>
  ["my-proposals", "pre-review", "audit-list", "skills"].includes(id),
);
const adminMenu = menu.filter(([id]) =>
  ["lifecycle", "organize-submit", "review-tracking", "meeting-materials", "task-breakdown", "execution-tracking", "skills", "templates", "permissions"].includes(id),
);
const userPages = new Set(userMenu.map(([id]) => id));
const adminPages = new Set(adminMenu.map(([id]) => id));
const skillsSeed = [
  {
    id: "organize",
    name: "璁鏁寸悊涓庨瀹℃妧鑳?,
    desc: "浠庣敵璇疯〃鍜岄檮浠舵彁鍙栧瓧娈碉紝褰㈡垚棰勫琛ㄤ笌璁渚濇嵁銆?,
    enabled: true,
    prompt: "璇锋寜銆婃垬鎵у璁妯℃澘銆嬫暣鐞嗚妗堬紝鏍搁獙鏉愭枡瀹屾暣鎬у苟鐢熸垚璁渚濇嵁銆?,
  },
  {
    id: "functional",
    name: "鑱岃兘棰勫鎶€鑳?,
    desc: "鎻愮ず鑱岃兘閮ㄩ棬鍏虫敞鍒跺害銆侀绠椼€佷笓涓氶闄╁拰鏉愭枡瀹屾暣鎬с€?,
    enabled: true,
    prompt:
      "鎸夎亴璐ｈ竟鐣屾牎楠屽埗搴︿緷鎹€佷笓涓氶闄┿€侀绠楀彛寰勫拰闄勪欢瀹屾暣鎬э紝杈撳嚭鍙紪杈戞剰瑙併€?,
  },
  {
    id: "audit",
    name: "璁瀹℃牳涓庡悎瑙勬牳楠屾妧鑳?,
    desc: "渚涜妗堝鏍镐汉杩涜鍚堣涓庡喅绛栨潯浠跺垎鏋愩€?,
    enabled: false,
    prompt: "",
  },
  {
    id: "voting",
    name: "鎶曠エ鏅鸿兘璁剧疆鎶€鑳?,
    desc: "鎸夋姇绁ㄦā鏉胯嚜鍔ㄥ～鍏呰妗堟憳瑕併€侀€夐」鍜岄檮浠躲€?,
    enabled: true,
    prompt: "鏍规嵁宸插鏍歌妗堢敓鎴愰拤閽夋姇绁ㄥ崱瀛楁鍙婃姇绁ㄨ鏄庛€?,
  },
  {
    id: "speech",
    name: "鍐宠璇濇湳鐢熸垚鎶€鑳?,
    desc: "鎸夋姇绁ㄧ粨鏋滅敓鎴愪細璁邯瑕併€侀€氱煡鍙婁笅鍙戣瘽鏈€?,
    enabled: true,
    prompt: "渚濇嵁鎶曠エ閫氳繃鐨勮妗堢敓鎴愭寮忋€佺畝鏄庣殑鍐宠閫氱煡涓庢墽琛屾彁閱掋€?,
  },
];
type TemplateField = {
  key: string;
  label: string;
  description: string;
  aliases: string;
  type: string;
  required: boolean;
  priority: string;
  conflict: string;
};
type ProposalTemplate = {
  id: string;
  name: string;
  types: string[];
  version: string;
  status: "宸插彂甯? | "鑽夌" | "宸插仠鐢?;
  updatedAt: string;
  owner: string;
  usedCount: number;
  fields: TemplateField[];
  history: { version: string; date: string; owner: string; note: string; used: number }[];
};
type TaskBreakdownTemplate = {
  id: string;
  name: string;
  types: string[];
  version: string;
  status: ProposalTemplate["status"];
  updatedAt: string;
  owner: string;
  nodes: TaskNode[];
};
const templateFieldsSeed: TemplateField[] = [
  { key: "proposal_title", label: "璁鍚嶇О", description: "鍙緵鍐崇瓥涓庡綊妗ｈ瘑鍒殑瀹屾暣璁鏍囬銆?, aliases: "璁鍚嶇О銆侀」鐩悕绉?, type: "鏂囨湰", required: true, priority: "鍘熺敵璇疯〃浼樺厛", conflict: "鏍囪浜哄伐纭" },
  { key: "proposal_no", label: "璁缂栧彿", description: "璁鍦ㄧ郴缁熶腑鐨勫敮涓€缂栧彿銆?, aliases: "鐢宠缂栧彿銆佺紪鍙?, type: "鏂囨湰", required: true, priority: "鍘熺敵璇疯〃浼樺厛", conflict: "鏍囪浜哄伐纭" },
  { key: "proposal_type", label: "璁绫诲瀷", description: "鐢ㄤ簬鑷姩鍖归厤璁妯℃澘鍜屽鏍歌矾寰勩€?, aliases: "绫诲瀷銆佷簨椤圭被鍒?, type: "鏋氫妇", required: true, priority: "鍘熺敵璇疯〃浼樺厛", conflict: "鏍囪浜哄伐纭" },
  { key: "applicant_name", label: "鐢宠浜?, description: "鎻愬嚭鏈璁骞跺鐢宠鍐呭璐熻矗鐨勮嚜鐒朵汉濮撳悕銆?, aliases: "濮撳悕銆佸悕瀛椼€佹彁妗堜汉銆佽仈绯讳汉濮撳悕", type: "浜哄憳", required: true, priority: "鍘熺敵璇疯〃浼樺厛", conflict: "鏍囪浜哄伐纭" },
  { key: "owning_department", label: "鎵€灞為儴闂?, description: "瀵硅妗堢敵璇峰拰鍚庣画鎵ц璐熻矗鐨勫綊鍙ｉ儴闂ㄣ€?, aliases: "鐢虫姤閮ㄩ棬銆佽矗浠婚儴闂?, type: "缁勭粐", required: true, priority: "鍘熺敵璇疯〃浼樺厛", conflict: "鏍囪浜哄伐纭" },
  { key: "proposal_basis", label: "璁渚濇嵁", description: "鏀拺鏈璁鐨勫埗搴︺€佹巿鏉冩垨缁忚惀渚濇嵁銆?, aliases: "鏀跨瓥渚濇嵁銆佸埗搴︿緷鎹€佺珛椤逛緷鎹?, type: "闀挎枃鏈?, required: true, priority: "闄勪欢琛ュ厖", conflict: "鏍囪浜哄伐纭" },
  { key: "decision_item", label: "鍐崇瓥浜嬮」", description: "闇€濮斿憳浼氬璁€佸喅绛栨垨鎺堟潈鐨勫叿浣撲簨椤广€?, aliases: "瀹¤浜嬮」銆佸喅绛栧唴瀹?, type: "闀挎枃鏈?, required: true, priority: "鍘熺敵璇疯〃浼樺厛", conflict: "鏍囪浜哄伐纭" },
  { key: "benefit_amount", label: "棰勮澶勭疆鏀剁泭", description: "棰勬湡鏀剁泭鎴栨崯鐩婇噾棰濓紝闇€淇濈暀閲戦涓庤閲忓崟浣嶃€?, aliases: "棰勮鏀剁泭銆佹敹鐩婃祴绠椼€佸缃敹鐩?, type: "閲戦", required: false, priority: "闄勪欢琛ュ厖", conflict: "鏍囪浜哄伐纭" },
  { key: "risk_notice", label: "椋庨櫓鎻愮ず", description: "闇€鍦ㄥ鏍告椂鍏虫敞鐨勯闄┿€侀檺鍒舵垨鍓嶇疆鏉′欢銆?, aliases: "椋庨櫓銆侀闄╄鏄庛€佹敞鎰忎簨椤?, type: "闀挎枃鏈?, required: true, priority: "闄勪欢琛ュ厖", conflict: "鏍囪浜哄伐纭" },
  { key: "completion_date", label: "璁″垝瀹屾垚鏃堕棿", description: "璁鑾锋壒鍚庤鍒掕揪鎴愮殑鏃ユ湡鎴栨椂闂磋妭鐐广€?, aliases: "瀹屾垚鏃ユ湡銆佸畬鎴愭椂闂淬€佽鍒掕妭鐐?, type: "鏃ユ湡", required: false, priority: "闄勪欢琛ュ厖", conflict: "鏍囪浜哄伐纭" },
];
const templatesSeed: ProposalTemplate[] = [
  {
    id: "tpl-business", name: "缁忚惀鍐崇瓥绫昏妗堟ā鏉?, types: ["缁忚惀鍐崇瓥绫?], version: "V2.1", status: "宸插彂甯?, updatedAt: "2026-08-12 10:20", owner: "鐜嬫シ鐓?, usedCount: 18, fields: templateFieldsSeed,
    history: [
      { version: "V2.1", date: "2026-08-12 10:20", owner: "鐜嬫シ鐓?, note: "琛ュ厖瀛楁鍒悕銆佹潵婧愪紭鍏堢骇鍜屽啿绐佹彁绀鸿鍒?, used: 18 },
      { version: "V2.0", date: "2026-07-28 16:40", owner: "鏉庢櫒", note: "鏂板椋庨櫓鎻愮ず涓庤鍒掑畬鎴愭椂闂?, used: 6 },
      { version: "V1.0", date: "2026-06-20 09:10", owner: "鏉庢櫒", note: "棣栨鍙戝竷", used: 0 },
    ],
  },
  {
    id: "tpl-invest", name: "椤圭洰鎶曡祫绫昏妗堟ā鏉?, types: ["椤圭洰鎶曡祫绫?, "鎶€鏀规姇璧勭被"], version: "V2.1", status: "宸插彂甯?, updatedAt: "2026-08-10 15:40", owner: "鏉庢櫒", usedCount: 26, fields: templateFieldsSeed.map((f) => ({ ...f, required: f.key !== "benefit_amount" })),
    history: [{ version: "V2.1", date: "2026-08-10 15:40", owner: "鏉庢櫒", note: "瀹屽杽鎶曡祫娴嬬畻瀛楁鍜岄檮浠跺尮閰嶈鍒?, used: 26 }, { version: "V1.8", date: "2026-07-08 11:30", owner: "鐜嬫シ鐓?, note: "鏂板璁″垝瀹屾垚鏃堕棿", used: 9 }],
  },
  {
    id: "tpl-hr", name: "浜轰簨浠诲厤绫昏妗堟ā鏉?, types: ["浜轰簨浠诲厤绫?], version: "V1.4", status: "宸插彂甯?, updatedAt: "2026-08-06 14:05", owner: "闄堥", usedCount: 4, fields: templateFieldsSeed.slice(0, 7),
    history: [{ version: "V1.4", date: "2026-08-06 14:05", owner: "闄堥", note: "澧炲姞浠昏亴璧勬牸涓庡洖閬夸簨椤瑰埆鍚?, used: 4 }],
  },
  {
    id: "tpl-major", name: "閲嶅ぇ浜嬮」璁妯℃澘", types: ["閲嶅ぇ浜嬮」绫?], version: "V1.0", status: "鑽夌", updatedAt: "2026-08-12 09:45", owner: "鐜嬫シ鐓?, usedCount: 0, fields: templateFieldsSeed.slice(0, 8),
    history: [{ version: "V1.0", date: "2026-08-12 09:45", owner: "鐜嬫シ鐓?, note: "绛夊緟瀛楁鏍￠獙鍚庡彂甯?, used: 0 }],
  },
];
const taskTemplatesSeed: TaskBreakdownTemplate[] = [
  { id: "task-hr", name: "浜轰簨浠诲厤绫讳换鍔℃媶瑙ｆā鏉?, types: ["浜轰簨浠诲厤绫?], version: "V1.0", status: "宸插彂甯?, updatedAt: "2026-08-13 09:10", owner: "闄堥", nodes: [
    { name: "浠诲懡閫氱煡涓庣粍缁囧妗?, department: "浜哄姏璧勬簮閮?, owner: "闄堥", proofRequired: true, deadline: "2026-08-20" },
    { name: "宀椾綅浜ゆ帴涓庡饱鑱岃窡韪?, department: "浜哄姏璧勬簮閮?, owner: "鐜嬫シ鐓?, proofRequir…42674 tokens truncated…          >
                          鍒犻櫎
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <ContextSkillBar
                    skill={targetSkill}
                    description="鐢ㄤ簬鎸夋姇绁ㄧ粨鏋滅敓鎴愰拤閽夊喅璁€氱煡涓庡悗缁墽琛屾彁閱掞紱淇敼鍚庡彲绔嬪嵆閲嶆柊鐢熸垚銆?
                    onClick={() => setEditSkill(true)}
                  />
                  <header className="pane-title">
                    <div>
                      <b>寤鸿鍙戦€佽瘽鏈?/b>
                      <p>
                        {generated
                          ? "宸叉寜鏈€鏂板喅璁瘽鏈敓鎴愭妧鑳介噸鏂扮敓鎴愶紝鍙户缁汉宸ヨ皟鏁淬€?
                          : "纭璇濇湳鍚庣敓鎴愰拤閽夊喅璁€氱煡銆?}
                      </p>
                    </div>
                  </header>
                  <textarea
                    value={speechDraft}
                    onChange={(e) => setSpeechDraft(e.target.value)}
                  />
                </>
              )}
            </div>
            <footer>
              {isVote ? (
                <button className="pam-primary" onClick={launchVote}>
                  <Vote size={15} />
                  纭骞跺彂璧锋姇绁?                </button>
              ) : (
                <>
                  <button className="plain" onClick={onClose}>
                    浠呬繚瀛樿崏绋?                  </button>
                  <button
                    className="pam-primary"
                    onClick={() => {
                      notice("宸茬敓鎴愬苟妯℃嫙鍙戦€侀拤閽夊喅璁€氱煡");
                      onClose();
                    }}
                  >
                    <Send size={15} />
                    纭鐢熸垚閫氱煡
                  </button>
                </>
              )}
            </footer>
          </>
        ) : (
          <>
            <div className="review-modal">
              <section>
                <b>
                  {kind.includes("functional")
                    ? "鑱岃兘瀹℃牳渚濇嵁"
                    : "瀹℃牳鍒嗘瀽缁撴灉"}
                </b>
                <p>
                  {skill
                    ? "绯荤粺宸插熀浜庡凡淇濆瓨鎶€鑳界敓鎴愬缓璁紱璇峰湪纭鍓嶄汉宸ュ鏍搞€?
                    : "褰撳墠涓轰汉宸ュ鏍革紝璇风粨鍚堢敵璇疯〃鍙婇檮浠跺～鍐欐剰瑙併€?}
                </p>
                <div className="review-chips">
                  <span>鏉愭枡瀹屾暣鎬?/span>
                  <span>鍒跺害渚濇嵁</span>
                  <span>棰勭畻鍙ｅ緞</span>
                  <span>涓撲笟椋庨櫓</span>
                </div>
              </section>
              <label>
                瀹℃牳鎰忚锛堝彲浜哄伐淇敼锛?                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              </label>
            </div>
            <footer>
              <button className="danger" onClick={reject}>
                椹冲洖
              </button>
              <button className="pam-primary" onClick={approve}>
                <Check size={15} />
                閫氳繃
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
function RejectReasonModal({ p, onClose, onConfirm }: { p: Proposal; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("鎶曠エ鏈€氳繃锛屽鍛樿涓哄叧閿璇佷笌鎶曡祫鍥炴敹鏈熸祴绠椾粛涓嶅厖鍒嗭紝璇疯ˉ鍏呭悗閲嶆柊鎻愪氦銆?);
  return <div className="pam-overlay"><section className="pam-modal reject-reason-modal"><header><div><small>{p.id} 路 鎶曠エ缁撴灉澶勭悊</small><h2>椹冲洖璁</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header><section><label>椹冲洖鐞嗙敱<textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="璇峰～鍐欓┏鍥炵悊鐢憋紝鐢宠浜哄皢鏀跺埌閽夐拤鍗＄墖閫氱煡銆? /></label><p className="reject-hint">鎻愪氦鍚庡皢璁板綍鏈椹冲洖浜恒€佹剰瑙佸拰鐘舵€佸彉鏇达紝骞跺洖浼犺嚦鐢宠浜虹殑鈥滄垜鐨勮妗堚€濄€?/p></section><footer><button className="plain" onClick={onClose}>鍙栨秷</button><button className="danger" onClick={() => onConfirm(reason)}>纭椹冲洖</button></footer></section></div>;
}
function App() {
  const { page, setPage } = useHashPage(route);
  const [workspace, setWorkspace] = useState<"user" | "admin">(
    adminPages.has(page as never) ? "admin" : "user",
  );
  const [items, setItems] = useState(original);
  const [skills, setSkills] = useState(skillsSeed);
  const [templates, setTemplates] = useState(templatesSeed);
  const [taskTemplates, setTaskTemplates] = useState(taskTemplatesSeed);
  const [detail, setDetail] = useState<Proposal | null>(null);
  const [reviewDetail, setReviewDetail] = useState<{
    p: Proposal;
    mode: "pre" | "audit";
    auto: boolean;
  } | null>(null);
  const [personal, setPersonal] = useState<Proposal | null>(null);
  const [drafts, setDrafts] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ kind: string; p: Proposal } | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<Proposal | null>(null);
  const [organizeAudit, setOrganizeAudit] = useState<Proposal | null>(null);
  const [submitPreview, setSubmitPreview] = useState<Proposal | null>(null);
  const [sendPreview, setSendPreview] = useState<Proposal | null>(null);
  const [templatePreview, setTemplatePreview] = useState<Proposal | null>(null);
  const [meetingFlow, setMeetingFlow] = useState<{ kind: "materials" | "attendees" | "remind"; p: Proposal } | null>(null);
  const [taskFlow, setTaskFlow] = useState<{ kind: "breakdown" | "dispatch"; p: Proposal } | null>(null);
  const [taskProgress, setTaskProgress] = useState<Proposal | null>(null);
  const [executionDetail, setExecutionDetail] = useState<Proposal | null>(null);
  const [executionReview, setExecutionReview] = useState<Proposal | null>(null);
  const [executionArchive, setExecutionArchive] = useState<Proposal | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    const showTemplate = (event: Event) => setTemplatePreview((event as CustomEvent<Proposal>).detail);
    window.addEventListener("proposal-template-preview", showTemplate);
    return () => window.removeEventListener("proposal-template-preview", showTemplate);
  }, []);
  const notice = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 3200);
  };
  const switchWorkspace = (next: "user" | "admin") => {
    setWorkspace(next);
    const pages = next === "user" ? userPages : adminPages;
    if (!pages.has(page as never)) {
      if (next === "user") setPage("my-proposals");
      else setPage("lifecycle");
    }
  };
  const update = (id: string, stage: Stage, status: string, reason?: string) =>
    setItems((v) =>
      v.map((p) =>
        p.id === id
          ? {
              ...p,
              stage,
              status,
              reason: reason ?? p.reason,
              revised:
                stage === "functional" && p.stage === "returned"
                  ? true
                  : p.revised,
            }
          : p,
      ),
    );
  const savePersonal = (p: Proposal, attachments: string[]) => {
    setItems((v) =>
      v.map((x) => (x.id === p.id ? { ...x, title: p.title, attachments } : x)),
    );
    setDrafts((v) => new Set([...v, p.id]));
    notice("淇敼宸蹭繚瀛橈紝璇风‘璁ゅ悗鐐瑰嚮鈥滄彁浜も€濋噸鏂板彂璧峰鏍?);
  };
  const submitPersonal = (p: Proposal) => {
    update(p.id, "functional", "椹冲洖淇敼鍚?路 寰呰亴鑳介瀹?);
    setDrafts((v) => {
      const n = new Set(v);
      n.delete(p.id);
      return n;
    });
    notice("宸叉彁浜や慨鏀瑰悗鐨勮妗堬紝绯荤粺宸蹭繚鐣欑増鏈褰曞苟閲嶆柊鍙戦€佽亴鑳介瀹?);
  };
  const open = (kind: string, p: Proposal) => {
    if (kind === "reject") {
      setDetail(p);
      return;
    }
    if (kind === "functional" || kind === "audit") {
      setReviewDetail({
        p,
        mode: kind === "functional" ? "pre" : "audit",
        auto: true,
      });
      return;
    }
    setModal({ kind, p });
  };
  const openReview = (mode: "pre" | "audit") => (p: Proposal) =>
    setReviewDetail({ p, mode, auto: false });
  const common = {
    items,
    skills,
    onDetail: setDetail,
    onOpen: open,
    setItems,
    notice,
  };
  let content: React.ReactNode;
  if (page === "my-proposals")
    content = (
      <MyProposals
        items={items}
        onDetail={setPersonal}
        onEdit={setPersonal}
        onSubmit={submitPersonal}
        drafts={drafts}
      />
    );
  else if (page === "lifecycle") content = <Lifecycle items={items} onDetail={setDetail} />;
  else if (page === "organize-submit") content = <OrganizeSubmit items={items} skills={skills} onDetail={setDetail} onOpen={open} onAudit={setOrganizeAudit} onSubmitPreview={setSubmitPreview} onSendPreview={setSendPreview} notice={notice} />;
  else if (page === "review-tracking") content = <ReviewTracking items={items} onDetail={setDetail} />;
  else if (page === "meeting-materials") content = <MeetingMaterials items={items} onDetail={setDetail} onOpen={open} onFlow={(kind, p) => setMeetingFlow({ kind, p })} onReject={setRejectTarget} />;
  else if (page === "task-breakdown") content = <TaskBreakdownPage items={items} onDetail={setDetail} onFlow={(kind, p) => setTaskFlow({ kind, p })} onProgress={setTaskProgress} />;
  else if (page === "execution-tracking") content = <ExecutionTracking items={items} onOpen={setExecutionDetail} onReview={setExecutionReview} onArchive={setExecutionArchive} />;
  else if (page === "pre-review")
    content = (
      <ReviewList
        title="棰勫鏍稿垪琛?
        desc="鑱岃兘閮ㄩ棬鎸夎亴璐ｆ牳楠岃妗堬紝鏀寔鏅鸿兘棰勫寤鸿鍜屼汉宸ュ鐞嗙粨璁恒€?
        kind="functional"
        items={items}
        skills={skills}
        onDetail={openReview("pre")}
        onOpen={open}
      />
    );
  else if (page === "audit-list")
    content = (
      <ReviewList
        title="瀹℃牳鍒楄〃"
        desc="闈㈠悜璁瀹℃牳浜虹殑寰呭姙闆嗗悎锛屾敮鎸佹櫤鑳藉鏍稿缓璁拰浜哄伐澶勭悊缁撹銆?
        kind="audit"
        items={items}
        skills={skills}
        onDetail={openReview("audit")}
        onOpen={open}
      />
    );
  else if (page === "skills")
    content = <Skills skills={skills} setSkills={setSkills} notice={notice} />;
  else if (page === "templates")
    content = <Templates templates={templates} setTemplates={setTemplates} taskTemplates={taskTemplates} setTaskTemplates={setTaskTemplates} notice={notice} />;
  else content = <Permissions />;
  return (
    <>
      <style>
        {personalCss +
          organizeCss +
          skillPopupCss +
          layoutRepairCss +
          contextSkillCss +
          organizeScrollCss +
          organizeAuditCss +
          organizeExpandCss +
          submissionCss +
          submissionScrollCss +
          disabledActionCss +
          templatePreviewCss +
          meetingFlowCss +
          templateCss +
          taskFlowCss +
          executionCss}
      </style>
      <Shell page={page} setPage={setPage} workspace={workspace} setWorkspace={switchWorkspace}>
        {content}
        {personal && (
          <PersonalDetail
            p={personal}
            onClose={() => setPersonal(null)}
            onSave={savePersonal}
            onSubmit={submitPersonal}
            draft={drafts.has(personal.id)}
          />
        )}{" "}
        {reviewDetail && (
          <ReviewDetail
            p={reviewDetail.p}
            mode={reviewDetail.mode}
            auto={reviewDetail.auto}
            onClose={() => setReviewDetail(null)}
            onUpdate={(stage, status, reason) =>
              update(reviewDetail.p.id, stage, status, reason)
            }
            notice={notice}
          />
        )}{" "}
        {detail && <Detail p={detail} onClose={() => setDetail(null)} />}{" "}
        {organizeAudit && (
          <OrganizeAuditDetail
            p={organizeAudit}
            onClose={() => setOrganizeAudit(null)}
            onPass={() => {
              setItems((v) => v.map((p) => p.id === organizeAudit.id ? { ...p, lifecycleStatus: "棰勫涓?, changeTime: "鍒氬垰" } : p));
              notice("鏁寸悊鍚庡唴瀹瑰凡澶嶆牳纭锛岃妗堣繘鍏ラ瀹′腑");
              setOrganizeAudit(null);
            }}
            onReturn={() => {
              setItems((v) => v.map((p) => p.id === organizeAudit.id ? { ...p, lifecycleStatus: "椹冲洖淇敼", changeTime: "鍒氬垰" } : p));
              notice("宸查€€鍥炵敵璇蜂汉缁х画淇敼锛屽苟淇濈暀鏈疆鏁寸悊涓庡鏍歌褰?);
              setOrganizeAudit(null);
            }}
          />
        )}{" "}
        {submitPreview && (
          <SubmissionPreview
            p={submitPreview}
            onClose={() => setSubmitPreview(null)}
            onConfirm={() => {
              setItems((v) => v.map((p) => p.id === submitPreview.id ? { ...p, lifecycleStatus: "棰勫涓?, changeTime: "鍒氬垰" } : p));
              notice("宸叉彁浜ら瀹★紝璁宸茶繘鍏ラ瀹′腑");
              setSubmitPreview(null);
            }}
          />
        )}{" "}
        {sendPreview && (
          <SubmissionPreview
            p={sendPreview}
            mode="send"
            onClose={() => setSendPreview(null)}
            onConfirm={() => {
              setItems((v) => v.map((p) => p.id === sendPreview.id ? { ...p, lifecycleStatus: "璁瀹℃牳涓?, changeTime: "鍒氬垰" } : p));
              notice("宸茬‘璁ら€佸锛岃妗堣繘鍏ュ鏍告祦绋嬭拷韪?);
              setSendPreview(null);
            }}
          />
        )}{" "}
        {templatePreview && <TemplatePreview p={templatePreview} templates={templates} onClose={() => setTemplatePreview(null)} />}{" "}
        {meetingFlow?.kind === "materials" && <MeetingMaterialsDraft p={meetingFlow.p} onClose={() => setMeetingFlow(null)} onNext={() => { setMeetingFlow({ kind: "attendees", p: meetingFlow.p }); notice("璁細鏉愭枡宸茬‘璁わ紝姝ｅ湪鏁寸悊鍙備細涓庢姇绁ㄤ俊鎭?); }} />}{" "}
        {meetingFlow?.kind === "attendees" && <AttendeeInfoDraft p={meetingFlow.p} onClose={() => setMeetingFlow(null)} onConfirm={() => { setItems((v) => v.map((p) => p.id === meetingFlow.p.id ? { ...p, lifecycleStatus: "寰呮姇绁?, changeTime: "鍒氬垰" } : p)); notice("鍙備細浜轰笌鎶曠エ浜哄凡纭锛屽凡鐢熸垚绾夸笂浼氳鎶曠エ閫氱煡"); setMeetingFlow(null); }} />}{" "}
        {meetingFlow?.kind === "remind" && <VoteReminder p={meetingFlow.p} onClose={() => setMeetingFlow(null)} onSend={(names) => { notice(`宸插悜 ${names.join("銆?)} 鍙戦€佸偓绁ㄦ彁閱抈); setMeetingFlow(null); }} />}{" "}
        {taskFlow?.kind === "breakdown" && <TaskBreakdownModal p={taskFlow.p} templates={taskTemplates} onClose={() => setTaskFlow(null)} onConfirm={(nodes) => { setItems((list) => list.map((p) => p.id === taskFlow.p.id ? { ...p, taskStatus: "浠诲姟寰呭垎鍙?, taskNodes: nodes, changeTime: "鍒氬垰" } : p)); notice("浠诲姟宸插畬鎴愭媶瑙ｏ紝杩涘叆鏅鸿兘鍒嗗彂鐜妭"); setTaskFlow(null); }} />}{" "}
        {taskFlow?.kind === "dispatch" && <TaskDispatchModal p={taskFlow.p} templates={taskTemplates} onClose={() => setTaskFlow(null)} onConfirm={() => { setItems((list) => list.map((p) => p.id === taskFlow.p.id ? { ...p, taskStatus: "浠诲姟瀹℃壒涓?, changeTime: "鍒氬垰" } : p)); notice("浠诲姟宸茬‘璁ゅ垎鍙戯紝姝ｅ湪杩涘叆钁ｄ簨灞€瀹℃壒涓庡鍛樹細澶囨娴佺▼"); setTaskFlow(null); }} />}{" "}
        {taskProgress && <TaskApprovalProgress p={taskProgress} onClose={() => setTaskProgress(null)} />}{" "}
        {executionDetail && <ExecutionProgressModal p={executionDetail} templates={taskTemplates} onClose={() => setExecutionDetail(null)} onRemind={() => notice(`宸插悜 ${defaultTaskNodes(executionDetail, taskTemplates)[1]?.owner || defaultTaskNodes(executionDetail, taskTemplates)[0].owner} 鍙戦€佽妭鐐瑰偓鍔炴彁閱抈)} />}{" "}
        {executionReview && <ExecutionReviewModal p={executionReview} templates={taskTemplates} onClose={() => setExecutionReview(null)} onReject={(summary) => { setItems((list) => list.map((p) => p.id === executionReview.id ? { ...p, executionStatus: "椹冲洖淇敼", changeTime: "鍒氬垰", executionRevision: { reviewer: "鍛ㄦ晱", time: "鍒氬垰", opinion: summary, changes: "寰呰矗浠婚儴闂ㄥ洖浼犳湰杞慨鏀瑰唴瀹广€? } } : p)); notice("鑺傜偣瀹℃牳宸查┏鍥烇紝璐ｄ换閮ㄩ棬灏嗘敹鍒颁慨鏀瑰缓璁?); setExecutionReview(null); }} onPass={() => { setItems((list) => list.map((p) => p.id === executionReview.id ? { ...p, executionStatus: "鎵ц涓?, changeTime: "鍒氬垰" } : p)); notice("褰撳墠鑺傜偣瀹℃牳閫氳繃锛屽凡杩涘叆涓嬩竴鎵ц鑺傜偣"); setExecutionReview(null); }} />}{" "}
        {executionArchive && <ExecutionArchiveModal p={executionArchive} onClose={() => setExecutionArchive(null)} onConfirm={() => { setItems((list) => list.map((p) => p.id === executionArchive.id ? { ...p, executionStatus: "宸插綊妗?, lifecycleStatus: "宸插綊妗?, changeTime: "鍒氬垰" } : p)); notice("鎵ц鎬荤粨鎶ュ憡涓庡叏娴佺▼璧勬枡宸叉墦鍖呮彁浜ゅ綊妗?); setExecutionArchive(null); }} />}{" "}
        {modal && (
          <WorkModal
            kind={modal.kind}
            p={modal.p}
            skills={skills}
            setSkills={setSkills}
            skill={
              modal.kind === "functional"
                ? skills.find((s) => s.id === "functional")?.enabled
                : modal.kind === "audit"
                  ? skills.find((s) => s.id === "audit")?.enabled
                  : undefined
            }
            onClose={() => setModal(null)}
            onUpdate={(stage, status, reason) =>
              update(modal.p.id, stage, status, reason)
            }
            notice={notice}
          />
        )}{" "}
        {rejectTarget && <RejectReasonModal p={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={(reason) => { update(rejectTarget.id, "votefailed", "鎶曠エ鏈€氳繃", reason); setItems((v) => v.map((p) => p.id === rejectTarget.id ? { ...p, lifecycleStatus: "鏈€氳繃", changeTime: "鍒氬垰", rejectionHistory: [{ person: "chenyi", role: "鎴樼暐鎵ц濮斿憳浼?, time: "2026-08-12 11:35", opinion: reason, changes: "鎶曠エ鏈€氳繃锛岃妗堟祦绋嬪凡缁撴潫銆? }, ...(p.rejectionHistory || [])] } : p)); notice("宸茬‘璁ゆ姇绁ㄦ湭閫氳繃骞堕€氱煡鐢宠浜猴紝璁娴佺▼宸茬粨鏉?); setRejectTarget(null); }} />}
        {toast && (
          <div className="pam-toast">
            <Check size={16} />
            {toast}
          </div>
        )}
      </Shell>
    </>
  );
}
export default App;

