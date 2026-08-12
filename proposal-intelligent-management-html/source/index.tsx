/** @name 议案智能管理 */
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

const route = defineHashPageRoute(
  [
    { id: "my-proposals", title: "我的议案" },
    { id: "proposal-list", title: "议案列表" },
    { id: "pre-review", title: "预审核列表" },
    { id: "audit-list", title: "审核列表" },
    { id: "skills", title: "技能定义" },
    { id: "templates", title: "模板管理" },
    { id: "permissions", title: "权限管理" },
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
};
const original: Proposal[] = [
  {
    id: "PA-2026-0086",
    title: "2026年技改投资项目调整议案",
    source: "卓越流程",
    applicant: "王磊",
    department: "生产技术部",
    time: "今天 09:28",
    stage: "received",
    status: "待整理",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    attachments: ["技改投资申请表.xlsx", "项目可研报告.pdf", "测算明细.xlsx"],
  },
  {
    id: "PA-2026-0081",
    title: "办公园区综合能源服务合作议案",
    source: "钉钉提交",
    applicant: "李晨",
    department: "行政管理部",
    time: "今天 08:42",
    stage: "functional",
    status: "待预审",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.1",
    attachments: ["议案申请表.docx", "合作方方案.pdf"],
  },
  {
    id: "PA-2026-0079",
    title: "闲置资产处置方案议案",
    source: "门户提交",
    applicant: "王楷煜",
    department: "资产管理部",
    time: "昨天 16:10",
    stage: "returned",
    status: "驳回修改",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.0",
    reason: "请补充资产评估报告，并明确处置收益测算口径。",
    attachments: ["处置申请表_v2.docx", "资产评估报告.pdf"],
  },
  {
    id: "PA-2026-0074",
    title: "HSE专项隐患治理资金使用议案",
    source: "卓越流程",
    applicant: "赵璇",
    department: "安全环保部",
    time: "昨天 14:23",
    stage: "audit",
    status: "待议案审核",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.1",
    attachments: ["专项申请表.docx", "隐患治理清单.xlsx"],
  },
  {
    id: "PA-2026-0072",
    title: "供应链协同降本年度框架议案",
    source: "门户提交",
    applicant: "周敏",
    department: "供应链管理部",
    time: "昨天 11:06",
    stage: "audit",
    status: "待审核",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.1",
    attachments: ["年度框架议案.docx", "降本测算.xlsx", "供应商分析.pdf"],
  },
  {
    id: "PA-2026-0067",
    title: "废水处理系统升级改造议案",
    source: "卓越流程",
    applicant: "孙浩",
    department: "安全环保部",
    time: "08-10 16:35",
    stage: "audit",
    status: "驳回修改",
    templateName: "项目投资类议案模板",
    templateVersion: "V1.8",
    reason: "请补充环保验收依据，并说明改造期间的连续生产保障方案。",
    attachments: ["升级改造申请表.docx", "环保评估报告.pdf"],
  },
  {
    id: "PA-2026-0064",
    title: "物流园仓储能力提升议案",
    source: "钉钉提交",
    applicant: "刘畅",
    department: "物流管理部",
    time: "08-10 09:18",
    stage: "audit",
    status: "驳回修改后待审核",
    templateName: "项目投资类议案模板",
    templateVersion: "V1.8",
    reason: "上一轮要求补充投资回收期测算，申请人已重新提交测算附件。",
    revised: true,
    attachments: [
      "仓储提升议案_v2.docx",
      "投资回收期测算.xlsx",
      "物流方案.pdf",
    ],
  },
  {
    id: "PA-2026-0060",
    title: "研发实验室设备购置议案",
    source: "门户提交",
    applicant: "许宁",
    department: "研发管理部",
    time: "08-09 14:40",
    stage: "audit",
    status: "审核中",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    attachments: ["设备购置申请表.docx", "设备清单.xlsx", "询价对比表.pdf"],
  },
  {
    id: "PA-2026-0068",
    title: "高级管理人员聘任事项议案",
    source: "钉钉提交",
    applicant: "陈颖",
    department: "人力资源部",
    time: "08-10 15:40",
    stage: "auditpassed",
    status: "审核通过",
    templateName: "人事任免类议案模板",
    templateVersion: "V1.4",
    attachments: ["聘任议案.docx", "履历及考察材料.pdf"],
  },
  {
    id: "PA-2026-0061",
    title: "生产装置节能技改事项议案",
    source: "门户提交",
    applicant: "王楷煜",
    department: "生产技术部",
    time: "08-08 10:12",
    stage: "votefailed",
    status: "投票未通过",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    reason: "参会委员认为投资回收期说明不足，建议完善后重新申报。",
    attachments: ["技改事项申请表.docx", "节能评估.pdf"],
  },
  {
    id: "PA-2026-0056",
    title: "数字化平台建设二期议案",
    source: "卓越流程",
    applicant: "王楷煜",
    department: "信息管理部",
    time: "08-06 13:20",
    stage: "votepassed",
    status: "投票通过",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    attachments: ["立项申请表.docx", "预算测算.xlsx"],
  },
];
const menu = [
  ["my-proposals", "我的议案", ClipboardList],
  ["proposal-list", "议案列表", LayoutList],
  ["pre-review", "预审核列表", FileCheck2],
  ["audit-list", "审核列表", ShieldCheck],
  ["skills", "技能定义", Sparkles],
  ["templates", "模板管理", FileCog],
  ["permissions", "权限管理", LockKeyhole],
] as const;
const skillsSeed = [
  {
    id: "organize",
    name: "议案整理与预审技能",
    desc: "从申请表和附件提取字段，形成预审表与议案依据。",
    enabled: true,
    prompt: "请按《战执委议案模板》整理议案，核验材料完整性并生成议案依据。",
  },
  {
    id: "functional",
    name: "职能预审技能",
    desc: "提示职能部门关注制度、预算、专业风险和材料完整性。",
    enabled: true,
    prompt:
      "按职责边界校验制度依据、专业风险、预算口径和附件完整性，输出可编辑意见。",
  },
  {
    id: "audit",
    name: "议案审核与合规核验技能",
    desc: "供议案审核人进行合规与决策条件分析。",
    enabled: false,
    prompt: "",
  },
  {
    id: "voting",
    name: "投票智能设置技能",
    desc: "按投票模板自动填充议案摘要、选项和附件。",
    enabled: true,
    prompt: "根据已审核议案生成钉钉投票卡字段及投票说明。",
  },
  {
    id: "speech",
    name: "决议话术生成技能",
    desc: "按投票结果生成会议纪要、通知及下发话术。",
    enabled: true,
    prompt: "依据投票通过的议案生成正式、简明的决议通知与执行提醒。",
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
  status: "已发布" | "草稿" | "已停用";
  updatedAt: string;
  owner: string;
  usedCount: number;
  fields: TemplateField[];
  history: { version: string; date: string; owner: string; note: string; used: number }[];
};
const templateFieldsSeed: TemplateField[] = [
  { key: "proposal_title", label: "议案名称", description: "可供决策与归档识别的完整议案标题。", aliases: "议题名称、项目名称", type: "文本", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "proposal_no", label: "议案编号", description: "议案在系统中的唯一编号。", aliases: "申请编号、编号", type: "文本", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "proposal_type", label: "议案类型", description: "用于自动匹配议案模板和审核路径。", aliases: "类型、事项类别", type: "枚举", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "applicant_name", label: "申请人", description: "提出本次议案并对申请内容负责的自然人姓名。", aliases: "姓名、名字、提案人、联系人姓名", type: "人员", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "owning_department", label: "所属部门", description: "对议案申请和后续执行负责的归口部门。", aliases: "申报部门、责任部门", type: "组织", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "proposal_basis", label: "议案依据", description: "支撑本次议案的制度、授权或经营依据。", aliases: "政策依据、制度依据、立项依据", type: "长文本", required: true, priority: "附件补充", conflict: "标记人工确认" },
  { key: "decision_item", label: "决策事项", description: "需委员会审议、决策或授权的具体事项。", aliases: "审议事项、决策内容", type: "长文本", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "benefit_amount", label: "预计处置收益", description: "预期收益或损益金额，需保留金额与计量单位。", aliases: "预计收益、收益测算、处置收益", type: "金额", required: false, priority: "附件补充", conflict: "标记人工确认" },
  { key: "risk_notice", label: "风险提示", description: "需在审核时关注的风险、限制或前置条件。", aliases: "风险、风险说明、注意事项", type: "长文本", required: true, priority: "附件补充", conflict: "标记人工确认" },
  { key: "completion_date", label: "计划完成时间", description: "议案获批后计划达成的日期或时间节点。", aliases: "完成日期、完成时间、计划节点", type: "日期", required: false, priority: "附件补充", conflict: "标记人工确认" },
];
const templatesSeed: ProposalTemplate[] = [
  {
    id: "tpl-business", name: "经营决策类议案模板", types: ["经营决策类"], version: "V2.1", status: "已发布", updatedAt: "2026-08-12 10:20", owner: "王楷煜", usedCount: 18, fields: templateFieldsSeed,
    history: [
      { version: "V2.1", date: "2026-08-12 10:20", owner: "王楷煜", note: "补充字段别名、来源优先级和冲突提示规则", used: 18 },
      { version: "V2.0", date: "2026-07-28 16:40", owner: "李晨", note: "新增风险提示与计划完成时间", used: 6 },
      { version: "V1.0", date: "2026-06-20 09:10", owner: "李晨", note: "首次发布", used: 0 },
    ],
  },
  {
    id: "tpl-invest", name: "项目投资类议案模板", types: ["项目投资类", "技改投资类"], version: "V2.1", status: "已发布", updatedAt: "2026-08-10 15:40", owner: "李晨", usedCount: 26, fields: templateFieldsSeed.map((f) => ({ ...f, required: f.key !== "benefit_amount" })),
    history: [{ version: "V2.1", date: "2026-08-10 15:40", owner: "李晨", note: "完善投资测算字段和附件匹配规则", used: 26 }, { version: "V1.8", date: "2026-07-08 11:30", owner: "王楷煜", note: "新增计划完成时间", used: 9 }],
  },
  {
    id: "tpl-hr", name: "人事任免类议案模板", types: ["人事任免类"], version: "V1.4", status: "已发布", updatedAt: "2026-08-06 14:05", owner: "陈颖", usedCount: 4, fields: templateFieldsSeed.slice(0, 7),
    history: [{ version: "V1.4", date: "2026-08-06 14:05", owner: "陈颖", note: "增加任职资格与回避事项别名", used: 4 }],
  },
  {
    id: "tpl-major", name: "重大事项议案模板", types: ["重大事项类"], version: "V1.0", status: "草稿", updatedAt: "2026-08-12 09:45", owner: "王楷煜", usedCount: 0, fields: templateFieldsSeed.slice(0, 8),
    history: [{ version: "V1.0", date: "2026-08-12 09:45", owner: "王楷煜", note: "等待字段校验后发布", used: 0 }],
  },
];
const personalCss = `.pam-drawer.personal-drawer{width:min(900px,72vw);background:#f7f8fc}.personal-drawer>header{background:#fff}.personal-section{margin:14px 20px;background:#fff;border:1px solid #e2e7f1;border-radius:8px;overflow:hidden}.personal-section>header{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #edf0f5}.personal-section h3{margin:0;color:#344562;font-size:16px}.personal-section p{margin:4px 0 0;color:#8996ab;font-size:12px}.personal-section header .plain{padding:6px 10px}.application-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:7px 16px 16px;gap:0 16px}.application-form label{min-height:63px;padding:11px 0 8px;border-bottom:1px solid #eef1f5;display:flex;flex-direction:column;gap:7px}.application-form label span{font-size:12px;color:#8290a8}.application-form label b{font-weight:500;color:#41516d;line-height:1.5}.application-form label.wide{grid-column:span 3}.application-form input,.application-form select{height:32px;border:1px solid #dfe5ef;border-radius:5px;padding:0 8px;color:#41516d;background:#fff;outline-color:#6a5fe4;font:12px Microsoft YaHei}.attachment-section{margin-bottom:74px}.editable-files{padding:8px 16px 15px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.editable-files>div{border:1px solid #e4e8f0;border-radius:6px;min-height:38px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;background:#fbfcff}.editable-files .file{font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.editable-files button{border:0;background:transparent;color:#dc5964;font-size:12px;cursor:pointer}.personal-footer{position:sticky;bottom:0;z-index:2;background:#fff;border-top:1px solid #e3e8f2;box-shadow:0 -4px 14px #30406010;padding:13px 20px;display:flex;align-items:center;justify-content:flex-end;gap:9px}.personal-footer>span{margin-right:auto;color:#74829b;font-size:12px}.personal-drawer .return-box{margin:14px 20px 0}`;

function Status({ children }: { children: string }) {
  const c =
    children.includes("驳回") || children.includes("未通过")
      ? "bad"
      : children.includes("通过")
        ? "good"
        : children.includes("待")
          ? "wait"
          : "doing";
  return <span className={`pam-status ${c}`}>{children}</span>;
}
function Shell({
  page,
  setPage,
  children,
}: {
  page: string;
  setPage: (id: string) => void;
  children: React.ReactNode;
}) {
  const rail = [
    ["Chat", MessageSquareMore],
    ["旺财", Bot],
    ["页面", NotebookTabs],
    ["工具", Grid2X2],
    ["个人知识", Lightbulb],
    ["设置", Settings],
  ] as const;
  return (
    <div className="pam-app">
      <header className="pam-head">
        <div className="pam-logo">
          <i>≈</i>京博
        </div>
        <strong>京博AI</strong>
        <div>
          <button>下载京博AI</button>
          <span className="avatar">陈</span>
          <b>chenyi</b>
          <small>⌄</small>
        </div>
      </header>
      <div className="pam-body">
        <aside className="pam-rail">
          <div className="pam-coin">● 575</div>
          {rail.map(([n, I], i) => (
            <button className={i === 2 ? "active" : ""} key={n}>
              <I size={21} />
              <span>{n}</span>
            </button>
          ))}
        </aside>
        <main className="pam-work">
          <div className="pam-top-tabs">
            <b>议案智能管理</b>
            <span>智慧审批　　智慧周报　　智慧合同</span>
            <button>
              <Sparkles size={15} />
              AI智能识图
            </button>
          </div>
          <section className="pam-frame">
            <aside className="pam-menu">
              {menu.map(([id, n, I]) => (
                <button
                  className={page === id ? "selected" : ""}
                  onClick={() => setPage(id)}
                  key={id}
                >
                  <I size={18} />
                  {n}
                </button>
              ))}
            </aside>
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="pam-title">
      <div>
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children}
    </header>
  );
}

function ContextSkillBar({
  skill,
  description,
  onClick,
}: {
  skill: { name: string; enabled: boolean };
  description: string;
  onClick: () => void;
}) {
  return (
    <section className="context-skill-bar">
      <Sparkles size={20} />
      <div>
        <b>
          {skill.enabled ? `已启用 ${skill.name}` : `尚未配置 ${skill.name}`}
        </b>
        <span>{description}</span>
      </div>
      <button onClick={onClick}>
        {skill.enabled ? "查看 / 修改技能" : "配置技能"}
      </button>
    </section>
  );
}
function TemplatePin({ p }: { p: Proposal }) {
  return (
    <section className="template-pin">
      <FileCog size={17} />
      <div>
        <b>已锁定模板 · {p.templateName || "经营决策类议案模板"}</b>
        <span>{p.templateVersion || "V2.1"} · 议案发起时锁定，流转中不受后续模板发布影响</span>
      </div>
      <button onClick={() => (location.hash = "#page=templates")}>查看模板</button>
    </section>
  );
}
function ProposalTable({
  items,
  onDetail,
  action,
  showRevisionTag = true,
}: {
  items: Proposal[];
  onDetail: (p: Proposal) => void;
  action?: (p: Proposal) => React.ReactNode;
  showRevisionTag?: boolean;
}) {
  return (
    <div className="pam-table-wrap">
      <table className="pam-table">
        <thead>
          <tr>
            <th>议案编号 / 名称</th>
            <th>来源</th>
            <th>申请人</th>
            <th>所属部门</th>
            <th>当前状态</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <b>{p.title}</b>
                <small>
                  {p.id}
                  {showRevisionTag && p.revised && (
                    <em className="revised">驳回修改后</em>
                  )}
                </small>
              </td>
              <td>{p.source}</td>
              <td>{p.applicant}</td>
              <td>{p.department}</td>
              <td>
                <Status>{p.status}</Status>
              </td>
              <td>{p.time}</td>
              <td>
                <button className="link" onClick={() => onDetail(p)}>
                  查看
                </button>
                {action?.(p)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <div className="pam-empty">暂无待处理事项</div>}
    </div>
  );
}
function Stat({
  label,
  num,
  note,
  tone = "purple",
}: {
  label: string;
  num: string;
  note: string;
  tone?: string;
}) {
  return (
    <article className={`pam-stat ${tone}`}>
      <span>{label}</span>
      <b>{num}</b>
      <small>{note}</small>
    </article>
  );
}

function MyProposals({
  items,
  onDetail,
  onEdit,
  onSubmit,
  drafts,
}: {
  items: Proposal[];
  onDetail: (p: Proposal) => void;
  onEdit: (p: Proposal) => void;
  onSubmit: (p: Proposal) => void;
  drafts: Set<string>;
}) {
  const mine = items.filter((p) => p.applicant === "王楷煜");
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="申请人工作台"
        title="我的议案"
        desc="集中查看本人申请议案的流转状态、驳回意见和待修改事项。"
      />
      <section className="pam-card">
        <header>
          <div>
            <h2>我的申请记录</h2>
            <p>被驳回的议案会附带具体流程节点和处理意见。</p>
          </div>
          <button className="plain">
            筛选 <ChevronRight size={15} />
          </button>
        </header>
        <ProposalTable
          items={mine}
          onDetail={onDetail}
          showRevisionTag={false}
          action={(p) =>
            p.stage === "returned" || p.stage === "votefailed" ? (
              <button
                className="link strong"
                onClick={() => (drafts.has(p.id) ? onSubmit(p) : onEdit(p))}
              >
                {drafts.has(p.id) ? "提交" : "修改"}
              </button>
            ) : null
          }
        />
      </section>
    </main>
  );
}
function ProposalList({
  items,
  skills,
  onDetail,
  onOpen,
  setItems,
  notice,
}: {
  items: Proposal[];
  skills: any[];
  onDetail: (p: Proposal) => void;
  onOpen: (kind: string, p: Proposal) => void;
  setItems: any;
  notice: (s: string) => void;
}) {
  const enabled = (id: string) => skills.find((s) => s.id === id)?.enabled;
  const update = (id: string, stage: Stage, status: string) =>
    setItems((v: Proposal[]) =>
      v.map((p) => (p.id === id ? { ...p, stage, status } : p)),
    );
  const action = (p: Proposal) => {
    if (p.stage === "received")
      return (
        <button
          className="pam-action"
          disabled={!enabled("organize")}
          title={
            !enabled("organize")
              ? "请先在整理预审页面保存议案整理与预审技能"
              : ""
          }
          onClick={() => onOpen("organize", p)}
        >
          整理并预审
        </button>
      );
    if (p.stage === "prepassed")
      return (
        <button
          className="pam-action"
          onClick={() => {
            update(p.id, "audit", "待议案审核");
            notice("已提交议案，已进入议案审核列表");
          }}
        >
          提交议案
        </button>
      );
    if (p.stage === "auditpassed")
      return (
        <button
          className="pam-action"
          disabled={!enabled("voting")}
          onClick={() => onOpen("vote", p)}
        >
          投票智能设置
        </button>
      );
    if (p.stage === "voting")
      return (
        <button
          className="link strong"
          onClick={() => notice("已向未投票委员发送钉钉催办卡片")}
        >
          催办
        </button>
      );
    if (p.stage === "votepassed")
      return (
        <button
          className="pam-action"
          disabled={!enabled("speech")}
          onClick={() => onOpen("speech", p)}
        >
          话术生成
        </button>
      );
    if (p.stage === "votefailed")
      return (
        <button className="link strong" onClick={() => onOpen("reject", p)}>
          查看原因
        </button>
      );
    return null;
  };
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="战略执行委员会"
        title="议案列表"
        desc="统一收集各渠道议案，完成智能整理、预审确认、提交与投票协同。"
      >
        <div className="pam-title-actions">
          <button className="plain">
            <RefreshCw size={14} />
            刷新
          </button>
        </div>
      </PageTitle>
      <section className="pam-stats">
        <Stat label="待查看" num="28" note="新收集议案待确认" />
        <Stat
          label="待整理"
          num={`${items.filter((p) => p.stage === "received").length}`}
          note="需材料结构化"
          tone="orange"
        />
        <Stat
          label="待提交"
          num={`${items.filter((p) => p.stage === "prepassed").length}`}
          note="预审已通过，等待提交"
          tone="blue"
        />
        <Stat
          label="待投票"
          num={`${items.filter((p) => p.stage === "auditpassed").length}`}
          note="审核已通过，可设置投票"
          tone="green"
        />
      </section>
      <section className="pam-card">
        <header>
          <div>
            <h2>议案流转清单</h2>
            <p>原始材料、结构化结果、审核意见和附件全程随议案留痕。</p>
          </div>
          <label className="pam-search">
            ⌕ <input placeholder="搜索议案名称、编号或申请人" />
          </label>
        </header>
        <ProposalTable
          items={items}
          onDetail={onDetail}
          showRevisionTag={false}
          action={action}
        />
      </section>
    </main>
  );
}
function ReviewList({
  title,
  desc,
  items,
  kind,
  skills,
  onDetail,
  onOpen,
}: {
  title: string;
  desc: string;
  items: Proposal[];
  kind: "functional" | "audit";
  skills: any[];
  onDetail: (p: Proposal) => void;
  onOpen: (kind: string, p: Proposal) => void;
}) {
  const allowed = skills.find((s) => s.id === kind)?.enabled;
  const target =
    kind === "functional"
      ? items.filter((p) => p.stage === "functional" || p.stage === "returned")
      : items.filter((p) => p.stage === "audit");
  const canRunSmartReview = (p: Proposal) => {
    if (!allowed) return false;
    if (kind === "functional") {
      return ["待职能预审", "驳回修改后 · 待职能预审"].includes(p.status);
    }
    return ["待议案审核", "待审核", "驳回修改后待审核"].includes(p.status);
  };
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow={kind === "functional" ? "职能部门工作台" : "议案审核工作台"}
        title={title}
        desc={desc}
      />
      <section className="pam-skill-tip">
        <Sparkles size={18} />
        <div>
          <b>{allowed ? "已启用智能预审技能" : "尚未配置审核技能"}</b>
          <span>
            {allowed
              ? "点击“智能审核”或在详情中点击“智能预审”，即可生成可编辑的预审建议。"
              : "智能审核已禁用；你仍可查看完整材料、手工填写意见并作出结论。"}
          </span>
        </div>
        <button onClick={() => (location.hash = "#page=skills")}>
          {allowed ? "查看技能" : "去配置技能"}
        </button>
      </section>
      <section className="pam-card">
        <header>
          <div>
            <h2>{kind === "functional" ? "预审核清单" : "待议案审核"}</h2>
            <p>
              {kind === "functional"
                ? "包含待预审、驳回修改和驳回修改后待预审的议案。"
                : "审核通过后可由委员会进入投票智能设置。"}
            </p>
          </div>
          <span className="count">{target.length} 项待办</span>
        </header>
        <ProposalTable
          items={target}
          onDetail={onDetail}
          showRevisionTag={false}
          action={(p) =>
            canRunSmartReview(p) ? (
              <button className="pam-action" onClick={() => onOpen(kind, p)}>
                智能审核
              </button>
            ) : null
          }
        />
      </section>
    </main>
  );
}
function Skills({
  skills,
  setSkills,
  notice,
}: {
  skills: any[];
  setSkills: any;
  notice: (s: string) => void;
}) {
  const [pick, setPick] = useState(skills[0].id);
  const current = skills.find((s) => s.id === pick)!;
  const [draft, setDraft] = useState(current.prompt);
  const choose = (id: string) => {
    setPick(id);
    setDraft(skills.find((s) => s.id === id)!.prompt);
  };
  const save = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === pick ? { ...s, prompt: draft, enabled: !!draft.trim() } : s,
      ),
    );
    notice(
      draft.trim()
        ? `“${current.name}”已保存并启用`
        : `“${current.name}”尚未保存，相关一键操作已禁用`,
    );
  };
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="AI能力配置"
        title="技能定义"
        desc="为各处理环节维护可复用的审核、整理与生成规则；保存后才允许使用对应的一键能力。"
      />
      <section className="pam-skill-layout">
        <aside>
          {skills.map((s) => (
            <button
              className={pick === s.id ? "selected" : ""}
              onClick={() => choose(s.id)}
              key={s.id}
            >
              <Sparkles size={17} />
              <span>
                <b>{s.name}</b>
                <small>
                  {s.enabled ? "已保存 · 已启用" : "未配置 · 已禁用"}
                </small>
              </span>
            </button>
          ))}
        </aside>
        <section className="pam-card skill-editor">
          <header>
            <div>
              <h2>{current.name}</h2>
              <p>{current.desc}</p>
            </div>
            <Status>{current.enabled ? "已启用" : "未配置"}</Status>
          </header>
          <label>
            技能指令
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="请描述处理目标、判断标准、关注字段与输出格式…"
            />
          </label>
          <div className="skill-fields">
            <label>
              适用环节
              <input value={current.name} readOnly />
            </label>
            <label>
              输出方式
              <select defaultValue="建议">
                <option>建议</option>
                <option>结构化表格</option>
                <option>正式文档草稿</option>
              </select>
            </label>
          </div>
          <div className="skill-note">
            <Bell size={16} />
            保存空白技能
            会使相关“一键”按钮禁用，但人工审核、人工填写意见不会受影响。
          </div>
          <footer>
            <button className="plain" onClick={() => setDraft(current.prompt)}>
              恢复已保存内容
            </button>
            <button className="pam-primary" onClick={save}>
              <Check size={15} />
              保存技能
            </button>
          </footer>
        </section>
      </section>
    </main>
  );
}
function Templates({
  templates,
  setTemplates,
  notice,
}: {
  templates: ProposalTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ProposalTemplate[]>>;
  notice: (s: string) => void;
}) {
  const [pick, setPick] = useState(templates[0].id);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<"fields" | "history">("fields");
  const current = templates.find((t) => t.id === pick)!;
  const [name, setName] = useState(current.name);
  const [types, setTypes] = useState(current.types.join("、"));
  const [fields, setFields] = useState<TemplateField[]>(current.fields);
  useEffect(() => {
    setName(current.name);
    setTypes(current.types.join("、"));
    setFields(current.fields);
    setEditing(false);
    setTab("fields");
  }, [current]);
  const select = (id: string) => setPick(id);
  const addField = () =>
    setFields((v) => [
      ...v,
      { key: `custom_field_${v.length + 1}`, label: "新字段", description: "请说明字段业务含义。", aliases: "", type: "文本", required: false, priority: "原申请表优先", conflict: "标记人工确认" },
    ]);
  const patchField = (index: number, patch: Partial<TemplateField>) =>
    setFields((v) => v.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  const publish = () => {
    if (!name.trim() || !types.trim() || !fields.length || fields.some((f) => !f.key.trim() || !f.label.trim() || !f.description.trim())) {
      notice("请完善模板名称、适用类型以及每个字段的标识、名称和说明后再发布");
      return;
    }
    const nextVersion = current.status === "已发布" ? `V${(Number(current.version.slice(1).split(".")[0]) || 1) + 1}.0` : "V1.0";
    const now = "2026-08-12 11:10";
    setTemplates((list) => list.map((t) => t.id === current.id ? {
      ...t,
      name: name.trim(),
      types: types.split(/[、,，]/).map((x) => x.trim()).filter(Boolean),
      fields,
      version: nextVersion,
      status: "已发布",
      updatedAt: now,
      owner: "王楷煜",
      history: [{ version: nextVersion, date: now, owner: "王楷煜", note: "从草稿发布新版本；新申请自动使用，流转中议案保留锁定版本", used: 0 }, ...t.history],
    } : t));
    setEditing(false);
    notice(`已发布 ${nextVersion}；新申请将自动匹配新版本，流转中议案继续锁定原版本`);
  };
  const createDraft = () => {
    const id = `tpl-draft-${templates.length + 1}`;
    const draft: ProposalTemplate = { id, name: "未命名议案模板", types: ["未指定"], version: "V1.0", status: "草稿", updatedAt: "刚刚", owner: "王楷煜", usedCount: 0, fields: templateFieldsSeed.slice(0, 5), history: [] };
    setTemplates((v) => [draft, ...v]);
    setPick(id);
    setEditing(true);
    notice("已新建模板草稿，请完善字段后发布");
  };
  return (
    <main className="pam-content template-page">
      <PageTitle eyebrow="系统管理 · 模板管理员" title="模板管理" desc="维护字段结构与数据规则；系统按议案类型自动匹配最新已发布模板，并为流转中议案锁定版本。">
        <button className="pam-primary" onClick={createDraft}><Plus size={15} />新建模板</button>
      </PageTitle>
      <section className="template-rule-banner">
        <FileCog size={21} />
        <div><b>模板与技能分工</b><span>模板定义“收集什么、字段是什么意思、数据从哪里来”；技能定义“如何按业务规则判断、预审与生成”。</span></div>
        <span className="template-role">仅模板管理员可编辑</span>
      </section>
      <section className="template-layout">
        <aside className="template-list pam-card">
          <header><div><h2>议案模板</h2><p>按议案类型自动匹配。</p></div><span className="count">{templates.length} 个</span></header>
          {templates.map((t) => <button className={pick === t.id ? "selected" : ""} onClick={() => select(t.id)} key={t.id}>
            <FileText size={17} /><span><b>{t.name}</b><small>{t.types.join("、")} · {t.version}</small></span><Status>{t.status}</Status>
          </button>)}
        </aside>
        <section className="pam-card template-editor">
          <header>
            <div><h2>{editing ? "编辑模板草稿" : current.name}</h2><p>{editing ? "发布后自动生成新版本；不会覆盖流转中议案已锁定的版本。" : `${current.types.join("、")} · 最近更新 ${current.updatedAt} · 管理员 ${current.owner}`}</p></div>
            <div className="template-head-actions">{!editing && <Status>{current.status}</Status>}{!editing && <button className="plain" onClick={() => setEditing(true)}><PenLine size={14} />编辑新版本</button>}</div>
          </header>
          <div className="template-tabs"><button className={tab === "fields" ? "active" : ""} onClick={() => setTab("fields")}>字段配置</button><button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}><History size={14} />发布记录</button></div>
          {tab === "fields" ? <>
            <section className="template-basics">
              <label>模板名称{editing ? <input value={name} onChange={(e) => setName(e.target.value)} /> : <b>{current.name}</b>}</label>
              <label>适用议案类型{editing ? <input value={types} onChange={(e) => setTypes(e.target.value)} placeholder="多个类型以顿号分隔" /> : <b>{current.types.join("、")}</b>}</label>
              <label>当前版本<b>{current.version}{current.status === "已发布" ? " · 已发布" : " · 草稿"}</b></label>
              <label>默认冲突处理<b>标记人工确认</b></label>
            </section>
            <section className="field-rule-note"><CircleAlert size={16} /><span>每个字段的“系统标识”固定用于匹配与留痕；显示名称、说明与识别别名帮助模型理解“名字”等不同表述。来源不一致时一律提示人工确认。</span></section>
            <div className="template-field-head"><b>字段清单</b><span>{fields.length} 个字段</span>{editing && <button className="plain" onClick={addField}><Plus size={14} />添加字段</button>}</div>
            <div className="template-fields">
              {fields.map((field, i) => <article key={`${field.key}-${i}`}>
                <div className="field-top"><b>{i + 1}. {editing ? <input value={field.label} onChange={(e) => patchField(i, { label: e.target.value })} /> : field.label}</b>{editing ? <button className="remove-field" onClick={() => setFields((v) => v.filter((_, n) => n !== i))}>删除</button> : <>{field.required && <em>必填</em>}<span>{field.type}</span></>}</div>
                <div className="field-grid">
                  <label>系统标识{editing ? <input value={field.key} onChange={(e) => patchField(i, { key: e.target.value })} /> : <b>{field.key}</b>}</label>
                  <label>字段说明{editing ? <input value={field.description} onChange={(e) => patchField(i, { description: e.target.value })} /> : <b>{field.description}</b>}</label>
                  <label>识别别名{editing ? <input value={field.aliases} onChange={(e) => patchField(i, { aliases: e.target.value })} /> : <b>{field.aliases || "—"}</b>}</label>
                  <label>数据类型{editing ? <select value={field.type} onChange={(e) => patchField(i, { type: e.target.value })}><option>文本</option><option>长文本</option><option>人员</option><option>组织</option><option>金额</option><option>日期</option><option>枚举</option></select> : <b>{field.type}</b>}</label>
                  <label>来源优先级{editing ? <select value={field.priority} onChange={(e) => patchField(i, { priority: e.target.value })}><option>原申请表优先</option><option>附件补充</option><option>人工确认优先</option></select> : <b>{field.priority}</b>}</label>
                  <label>冲突规则{editing ? <select value={field.conflict} onChange={(e) => patchField(i, { conflict: e.target.value })}><option>标记人工确认</option><option>优先级自动采用</option><option>阻断流转</option></select> : <b>{field.conflict}</b>}</label>
                </div>
                {editing && <label className="required-toggle"><input type="checkbox" checked={field.required} onChange={(e) => patchField(i, { required: e.target.checked })} />必填字段</label>}
              </article>)}
            </div>
          </> : <section className="template-history">{current.history.map((h) => <article key={`${h.version}-${h.date}`}><span className="history-dot" /><div><b>{h.version} · {h.note}</b><p>{h.date} · {h.owner}</p></div><small>{h.used} 条议案使用</small></article>)}{!current.history.length && <div className="pam-empty">尚未发布版本</div>}</section>}
          {editing && <footer><button className="plain" onClick={() => { setEditing(false); setName(current.name); setTypes(current.types.join("、")); setFields(current.fields); }}>取消</button><button className="pam-primary" onClick={publish}><Check size={15} />校验并发布新版本</button></footer>}
        </section>
      </section>
    </main>
  );
}
function Permissions() {
  const [groups, setGroups] = useState([true, true, true, true, true, false, true]);
  const pages = [
    "我的议案",
    "议案列表",
    "预审核列表",
    "审核列表",
    "技能定义",
    "模板管理",
    "权限管理",
  ];
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="系统管理"
        title="权限管理"
        desc="管理员按组织与角色配置业务页面的可见范围和操作权限。"
      />
      <section className="pam-permissions">
        <article className="pam-card">
          <header>
            <div>
              <h2>角色组</h2>
              <p>点击角色查看对应权限。</p>
            </div>
            <button className="pam-primary">新建角色组</button>
          </header>
          {[
            ["议案申请人", "仅查看本人议案，可修改被驳回议案"],
            ["战略执行委员会", "整理预审、提交议案、投票协同"],
            ["职能部门审核人", "预审核列表、转办与审核结论"],
            ["议案审核人", "审核列表与审核结论"],
            ["模板管理员", "模板管理、模板版本发布与字段规则维护"],
            ["系统管理员", "技能定义、模板管理、权限管理"],
          ].map(([a, b]) => (
            <button className="role" key={a}>
              <span>◉</span>
              <div>
                <b>{a}</b>
                <small>{b}</small>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </article>
        <article className="pam-card">
          <header>
            <div>
              <h2>战略执行委员会 · 页面可见范围</h2>
              <p>勾选后该角色组成员可在左侧导航中看到相应页面。</p>
            </div>
          </header>
          <div className="page-checks">
            {pages.map((p, i) => (
              <label key={p}>
                <input
                  type="checkbox"
                  checked={groups[i]}
                  onChange={() =>
                    setGroups((v) => v.map((x, n) => (n === i ? !x : x)))
                  }
                />
                <span>{p}</span>
              <small>{i < 2 || i === 5 ? "可编辑" : "仅查看 / 按流程处理"}</small>
              </label>
            ))}
          </div>
          <footer>
            <button className="pam-primary">保存权限配置</button>
          </footer>
        </article>
      </section>
    </main>
  );
}

const applicationFields = [
  ["议案名称", "闲置资产处置方案议案"],
  ["议案编号", "PA-2026-0079"],
  ["议案类型", "经营决策类"],
  ["议案来源", "门户提交"],
  ["申请人", "王楷煜"],
  ["所属部门", "资产管理部"],
  ["申请日期", "2026-08-11"],
  ["联系人", "王楷煜"],
  ["联系电话", "186 5312 6288"],
  ["是否紧急", "否"],
  ["关联年度", "2026年度"],
  ["涉及组织", "资产管理部、财务管理部"],
  ["议案依据", "《固定资产管理办法》及处置授权清单"],
  ["议案背景", "部分闲置设备已超过经济使用年限，需要统一评估并处置。"],
  ["决策事项", "审议并明确闲置资产处置方式及授权范围。"],
  ["处置方式", "评估后协议转让"],
  ["预计处置收益", "286.50 万元"],
  ["预算影响", "不新增预算"],
  ["风险提示", "须完成评估备案并核验受让方资质。"],
  ["合规依据", "固定资产处置审批流程、招采与合同管理规范"],
  ["预期效益", "盘活存量资产，降低维护成本。"],
  ["计划完成时间", "2026-10-31"],
];
const organizeCss = `.pam-modal.organize-modal{width:min(1280px,calc(100vw - 44px))}.organize-body{display:grid;grid-template-columns:1fr 1fr;min-height:440px;max-height:62vh;overflow:hidden}.organize-pane{padding:18px;overflow:auto}.organize-pane+.organize-pane{border-left:1px solid #e7ebf2;background:#fcfcff}.organize-pane h3{font-size:15px;margin:0;color:#344562}.organize-pane>p{margin:5px 0 13px;color:#8390a6;font-size:12px}.organize-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 13px}.organize-form label{min-height:58px;padding:8px 0;border-bottom:1px solid #edf0f5;display:flex;flex-direction:column;gap:5px}.organize-form label.wide{grid-column:span 2}.organize-form span{font-size:12px;color:#8290a8}.organize-form b{font-weight:500;color:#465671;font-size:12px;line-height:1.5}.organize-form input{height:29px;border:1px solid #dfe4ee;border-radius:5px;padding:0 8px;color:#41516d;font:12px Microsoft YaHei;background:#fff;outline-color:#655ae3}.organize-form label.missing span{color:#df5963;font-weight:700}.organize-form label.missing input{border-color:#f2a9af;background:#fff8f8}.missing-mark,.ai-mark{margin-left:4px;border-radius:9px;padding:2px 5px;font-size:10px;font-style:normal}.missing-mark{background:#fff0f1;color:#dd5661}.ai-mark{background:#efedff;color:#6557df}.empty-value{font-style:normal;color:#a7afbd}.organize-files{margin-top:15px;border:1px solid #e5e9f1;border-radius:7px;background:#fafbfe;padding:11px}.organize-files b{font-size:12px;color:#52617b}.organize-files div{margin-top:7px;display:flex;gap:7px;align-items:center;color:#5862be;font-size:12px}.organize-files .missing-file{color:#d65d65}.organize-summary{padding:12px 18px 16px;border-top:1px solid #e8ebf2;background:#fff}.organize-summary label{display:block;font-size:13px;font-weight:700;color:#41516b}.organize-summary textarea{width:100%;height:62px;border:1px solid #dfe4ef;border-radius:6px;margin-top:7px;padding:9px;resize:vertical;color:#465570;font:12px/1.55 Microsoft YaHei;outline-color:#655ae3}.pane-title{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:0 0 12px}.pane-title>div{min-width:0}.pane-title b{color:#344562;font-size:15px}.pane-title p{margin:5px 0 0;color:#8390a6;font-size:12px;line-height:1.5}.pane-title .plain{flex:0 0 auto;white-space:nowrap;padding:6px 10px;font-size:12px}.inline-skill{position:relative;margin:14px 18px 0;border:1px solid #d9d5ff;border-radius:8px;background:#f7f6ff;padding:14px;box-shadow:0 5px 14px #5250b214}.inline-skill header{display:flex;align-items:flex-start;justify-content:space-between;gap:15px}.inline-skill b{display:block;color:#514bc5}.inline-skill small{display:block;margin-top:4px;color:#7783a0;font-size:12px}.inline-skill textarea{width:100%;height:88px;margin-top:10px;border:1px solid #d9d6f7;border-radius:6px;padding:9px;font:12px/1.55 Microsoft YaHei;color:#44536e;resize:vertical}.inline-skill footer{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}.vote-attachments{background:#f8f9fd;border:1px solid #edf0f5;border-radius:7px;padding:12px}.vote-attachments header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.vote-attachments header .plain{padding:5px 9px;font-size:12px}.vote-attachments>div{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-top:1px solid #e9edf4;font-size:12px}.vote-attachments span{display:flex;align-items:center;gap:6px;color:#5862be}.vote-attachments>div button{border:0;background:transparent;color:#dc5964;font-size:12px;cursor:pointer}.prereview-advice{margin:14px 20px 75px;background:#f2f1ff;border:1px solid #dad6ff;border-radius:8px;padding:14px}.prereview-advice header{display:flex;align-items:flex-start;justify-content:space-between}.prereview-advice h3{margin:0;color:#4c47c6;font-size:16px}.prereview-advice p{margin:4px 0 0;color:#7984a0;font-size:12px}.prereview-advice header>span{background:#e5e1ff;color:#5d55d8;border-radius:10px;padding:3px 7px;font-size:11px}.prereview-advice textarea{width:100%;height:92px;margin-top:11px;border:1px solid #d9d6f7;border-radius:6px;padding:9px;background:#fff;color:#44536e;font:13px/1.55 Microsoft YaHei;resize:vertical;outline-color:#655ae3}`;
const skillPopupCss = `.inline-skill{position:fixed!important;z-index:90;top:50%;left:50%;width:min(620px,calc(100vw - 48px));margin:0!important;transform:translate(-50%,-50%);padding:20px!important;background:#fff!important;box-shadow:0 18px 48px #1d244966!important}.inline-skill:before{content:"";position:fixed;z-index:-1;inset:-100vmax;background:#1e274f66}.inline-skill header{padding:0!important;border:0!important}.inline-skill textarea{height:180px!important}.inline-skill footer{padding:0!important;border:0!important}.inline-skill .plain{background:#fff}`;
const layoutRepairCss = `.pam-modal .vote-form{overflow:hidden!important}.pam-modal .pane-title{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;width:100%!important;max-width:100%!important;gap:12px!important}.pam-modal .pane-title>div{min-width:0!important}.pam-modal .pane-title .plain{width:auto!important;min-width:112px!important;height:32px!important;white-space:nowrap!important;writing-mode:horizontal-tb!important;justify-content:center!important;align-self:flex-start!important}.pam-modal .vote-form>label{display:block!important;width:100%!important}.pam-modal .vote-form>label input,.pam-modal .vote-form>label textarea{display:block!important;width:100%!important;box-sizing:border-box!important}.pam-modal .vote-attachments header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}.pam-modal .vote-attachments header .plain{width:auto!important;min-width:96px!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}.pam-modal .vote-attachments>div{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important}.pam-modal .vote-attachments>div span{min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.pam-modal .vote-attachments>div>button{width:auto!important;min-width:44px!important;padding:4px 8px!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}.pam-modal .inline-skill{box-sizing:border-box!important}`;
const contextSkillCss = `.context-skill-bar{margin:14px 20px 16px;padding:13px 15px;display:flex;align-items:center;gap:11px;background:#f2f0ff;border:1px solid #ded9ff;border-radius:8px;color:#6255de}.context-skill-bar>div{min-width:0;display:flex;flex-direction:column;gap:3px}.context-skill-bar b{font-size:14px;color:#5d50db}.context-skill-bar span{color:#7984a1;font-size:12px;line-height:1.45}.context-skill-bar button{margin-left:auto;flex:0 0 auto;border:0;background:transparent;color:#5e51dc;font:700 13px Microsoft YaHei;cursor:pointer;padding:5px}.vote-form>.context-skill-bar,.speech>.context-skill-bar{margin:0 0 16px}.inline-skill{width:min(680px,calc(100vw - 48px))!important;padding:0!important;border:0!important;border-radius:10px!important;overflow:hidden!important}.inline-skill header{display:block!important;padding:18px 20px 14px!important;border-bottom:1px solid #e7ebf2!important}.inline-skill b{font-size:17px!important;color:#344562!important}.inline-skill small{font-size:12px!important;line-height:1.55!important}.inline-skill textarea{display:block;width:calc(100% - 40px)!important;height:178px!important;margin:16px 20px!important;padding:11px!important;border:1px solid #dfe4ee!important;border-radius:7px!important;resize:vertical!important;font:13px/1.65 Microsoft YaHei!important;box-sizing:border-box!important}.inline-skill footer{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;padding:12px 20px!important;border-top:1px solid #e7ebf2!important;background:#fbfcff!important}.inline-skill footer .plain{height:34px!important}.inline-skill footer .pam-primary{height:34px!important;white-space:nowrap!important}`;
const organizeScrollCss = `.pam-modal.organize-modal{height:min(90vh,960px)!important;max-height:90vh!important;display:grid!important;grid-template-rows:auto auto minmax(0,1fr) auto auto!important;overflow:hidden!important}.pam-modal.organize-modal>.context-skill-bar{box-sizing:border-box;margin:12px 20px!important}.pam-modal.organize-modal>.organize-body{min-height:0!important;height:auto!important;max-height:none!important;overflow:hidden!important}.pam-modal.organize-modal .organize-pane{min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain}.pam-modal.organize-modal>.organize-summary{max-height:150px;overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box}.pam-modal.organize-modal>.organize-summary textarea{box-sizing:border-box;max-height:74px}.pam-modal.organize-modal>footer{margin:0!important;position:relative!important;z-index:2!important;box-shadow:0 -4px 12px #2e3d5b0c!important;flex:0 0 auto!important}`;
const templateCss = `.template-pin{margin:12px 20px;padding:10px 13px;display:flex;align-items:center;gap:9px;background:#f7f6ff;border:1px solid #ded9ff;border-radius:7px;color:#6155dc}.template-pin>div{display:flex;flex-direction:column;gap:2px;min-width:0}.template-pin b{font-size:12px;color:#4e49ba}.template-pin span{font-size:11px;color:#7f89a1;line-height:1.45}.template-pin button{margin-left:auto;flex:0 0 auto;border:0;background:transparent;color:#5e51dc;font:700 12px Microsoft YaHei;cursor:pointer;padding:4px}.template-page{padding-bottom:25px}.template-rule-banner{display:flex;align-items:center;gap:12px;padding:13px 15px;margin-bottom:15px;border:1px solid #ded9ff;border-radius:8px;background:#f4f2ff;color:#6155dc}.template-rule-banner>div{display:flex;flex-direction:column;gap:3px}.template-rule-banner b{font-size:14px}.template-rule-banner span{font-size:12px;color:#7783a1}.template-role{margin-left:auto;white-space:nowrap;color:#5d50db!important;font-weight:700}.template-layout{display:grid;grid-template-columns:265px minmax(0,1fr);gap:15px;align-items:start}.template-list{overflow:hidden}.template-list>header{min-height:64px}.template-list>button{width:100%;min-height:67px;border:0;border-top:1px solid #edf0f5;background:#fff;padding:11px 13px;display:flex;align-items:center;gap:9px;text-align:left;color:#61708a;cursor:pointer}.template-list>button:hover,.template-list>button.selected{background:#f4f2ff;color:#5a50d7}.template-list>button>span:nth-child(2){min-width:0;flex:1}.template-list b,.template-list small{display:block}.template-list b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#40516c;font-size:13px}.template-list small{margin-top:4px;color:#8995a8;font-size:11px}.template-list .pam-status{font-size:10px;padding:3px 6px}.template-editor{min-width:0}.template-editor>header{gap:13px}.template-head-actions{display:flex;align-items:center;gap:8px}.template-tabs{height:45px;padding:0 16px;border-bottom:1px solid #edf0f5;display:flex;gap:22px}.template-tabs button{height:45px;padding:0 2px;border:0;border-bottom:2px solid transparent;background:transparent;color:#7886a0;font:13px Microsoft YaHei;display:flex;gap:5px;align-items:center;cursor:pointer}.template-tabs button.active{color:#5e54df;border-bottom-color:#6257e5;font-weight:700}.template-basics{display:grid;grid-template-columns:1.3fr 1.3fr .8fr .9fr;gap:0 16px;padding:6px 16px 15px}.template-basics label{padding:10px 0;border-bottom:1px solid #edf0f5;display:flex;flex-direction:column;gap:6px;color:#8290a7;font-size:12px}.template-basics b{font-weight:500;color:#40516d}.template-basics input{height:31px;border:1px solid #dfe4ee;border-radius:5px;padding:0 8px;color:#44536e;font:12px Microsoft YaHei;outline-color:#6257e5}.field-rule-note{margin:0 16px 13px;padding:10px 12px;display:flex;gap:8px;border-radius:6px;background:#fff9e9;color:#9f792e;font-size:12px;line-height:1.55}.template-field-head{padding:0 16px 10px;display:flex;align-items:center;gap:8px}.template-field-head>b{font-size:14px;color:#40516c}.template-field-head>span{font-size:11px;color:#93a0b3}.template-field-head button{margin-left:auto;padding:6px 10px;font-size:12px}.template-fields{padding:0 16px 16px;max-height:405px;overflow:auto}.template-fields article{border:1px solid #e2e7f1;border-radius:7px;margin-bottom:9px;padding:11px 12px;background:#fff}.field-top{display:flex;align-items:center;gap:7px;margin-bottom:10px;color:#41516c}.field-top>b{font-size:13px;display:flex;align-items:center;gap:3px}.field-top>em{font-style:normal;background:#fff0eb;color:#df7955;border-radius:9px;padding:2px 6px;font-size:10px}.field-top>span{font-size:11px;color:#7886a0;background:#f4f6fa;border-radius:9px;padding:2px 6px}.field-top .remove-field{margin-left:auto;border:0;background:transparent;color:#d45d67;font:12px Microsoft YaHei;cursor:pointer}.field-top input{width:150px;height:28px;border:1px solid #dfe4ee;border-radius:5px;padding:0 6px;font:600 13px Microsoft YaHei;color:#40516c}.field-grid{display:grid;grid-template-columns:1fr 1.6fr 1.25fr 100px 125px 125px;gap:8px}.field-grid label{display:flex;flex-direction:column;gap:5px;color:#8793a8;font-size:11px;min-width:0}.field-grid b{font-weight:500;color:#4b5a73;font-size:12px;line-height:1.45;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.field-grid input,.field-grid select{width:100%;height:29px;border:1px solid #dfe4ee;border-radius:5px;padding:0 6px;color:#465570;background:#fff;font:11px Microsoft YaHei;outline-color:#6257e5}.required-toggle{display:flex;align-items:center;gap:5px;margin-top:10px;color:#63718a;font-size:11px}.required-toggle input{accent-color:#6257e5}.template-history{padding:8px 16px 16px}.template-history article{display:flex;align-items:center;gap:10px;min-height:66px;padding:10px 0;border-bottom:1px solid #edf0f5}.history-dot{width:10px;height:10px;border:2px solid #6358df;border-radius:50%;background:#fff}.template-history article>div{flex:1}.template-history b{font-size:13px;color:#42516b}.template-history p{margin:4px 0 0;color:#8c98aa;font-size:11px}.template-history small{color:#6072a1;font-size:11px}.template-editor>footer{margin-top:0}.template-editor>footer .pam-primary{white-space:nowrap}`;
function OrganizeReview({
  p,
  onClose,
  onUpdate,
  notice,
  skills,
  setSkills,
}: {
  p: Proposal;
  onClose: () => void;
  onUpdate: (stage: Stage, status: string, reason?: string) => void;
  notice: (s: string) => void;
  skills: any[];
  setSkills: any;
}) {
  const sourceBlank = [
    "议案依据",
    "处置方式",
    "预计处置收益",
    "风险提示",
    "合规依据",
    "预期效益",
    "计划完成时间",
  ];
  const smartFilled: { [key: string]: string } = {
    议案依据: "《固定资产管理办法》及处置授权清单",
    处置方式: "评估后协议转让",
    预计处置收益: "286.50 万元",
    合规依据: "固定资产处置审批流程、招采与合同管理规范",
    预期效益: "盘活存量资产，降低维护成本。",
    计划完成时间: "2026-10-31",
  };
  const mapValue = (label: string, value: string, smart = false) =>
    label === "议案名称"
      ? p.title
      : label === "议案来源"
        ? p.source
        : label === "申请人"
          ? p.applicant
          : label === "所属部门"
            ? p.department
            : smart && smartFilled[label]
              ? smartFilled[label]
              : sourceBlank.includes(label)
                ? ""
                : value;
  const originalFields = applicationFields.map(([label, value]) => ({
    label,
    value: mapValue(label, value),
  }));
  const makeMatched = () =>
    applicationFields.map(([label, value]) => ({
      label,
      value: mapValue(label, value, true),
      ai: !!smartFilled[label],
    }));
  const [matched, setMatched] = useState(makeMatched);
  const [summary, setSummary] = useState(
    "已从附件中智能补齐议案依据、处置方式、预计处置收益、合规依据、预期效益和计划完成时间；仍缺少风险提示，请人工补充后再提交预审。",
  );
  const [editingSkill, setEditingSkill] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const currentSkill = skills.find((s) => s.id === "organize")!;
  const [skillDraft, setSkillDraft] = useState(currentSkill.prompt);
  const change = (index: number, value: string) =>
    setMatched((v) =>
      v.map((f, i) => (i === index ? { ...f, value, ai: false } : f)),
    );
  const missing = matched.filter((f) => !f.value.trim()).map((f) => f.label);
  const saveSkill = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === "organize"
          ? { ...s, prompt: skillDraft, enabled: !!skillDraft.trim() }
          : s,
      ),
    );
    notice("已保存“议案整理与预审技能”，可按新规则重新智能生成当前议案");
  };
  const regenerate = () => {
    setMatched(makeMatched());
    setSummary(
      "已按最新议案整理与预审技能重新匹配附件内容：议案依据、处置方式、预计处置收益、合规依据、预期效益和计划完成时间已智能补齐；风险提示仍待人工补充。",
    );
    setRegenerated(true);
    notice("已按最新技能重新智能生成当前议案的匹配结果与审核建议");
  };
  const reject = () => {
    onUpdate("returned", "智能预审驳回", summary);
    notice("已驳回议案，并向申请人发送钉钉卡片通知");
    onClose();
  };
  const approve = () => {
    onUpdate("functional", "待职能预审");
    notice("预审确认通过，已将完整议案及附件发送至职能部门审核");
    onClose();
  };
  return (
    <>
      {editingSkill && (
        <section className="inline-skill">
          <header>
            <div>
              <b>技能配置</b>
              <small>
                {currentSkill.name} · 用于字段匹配、缺失提示和审核建议。
              </small>
            </div>
          </header>
          <textarea
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
          />
          <footer>
            <button className="plain" onClick={() => setEditingSkill(false)}>
              取消
            </button>
            <button
              className="pam-primary"
              disabled={!skillDraft.trim()}
              onClick={() => {
                saveSkill();
                regenerate();
                setEditingSkill(false);
              }}
            >
              <RefreshCw size={14} />
              保存并重新智能生成
            </button>
          </footer>
        </section>
      )}
      <ContextSkillBar
        skill={currentSkill}
        description="用于从申请信息和附件中匹配字段、识别缺失项，并生成可编辑的预审建议。"
        onClick={() => setEditingSkill(true)}
      />
      <TemplatePin p={p} />
      <div className="organize-body">
        <section className="organize-pane">
          <h3>原始申请信息</h3>
          <p>
            申请人实际填写的申请表；未填写字段保持为空，附件作为智能匹配依据。
          </p>
          <div className="organize-form">
            {originalFields.map((field, i) => (
              <label className={i >= 13 ? "wide" : ""} key={field.label}>
                <span>{field.label}</span>
                <b>{field.value || <i className="empty-value">未填写</i>}</b>
              </label>
            ))}
          </div>
          <div className="organize-files">
            <b>原始附件材料</b>
            {p.attachments.map((a) => (
              <div key={a}>
                <FileText size={15} />
                {a}
              </div>
            ))}
          </div>
        </section>
        <section className="organize-pane">
          <header className="pane-title">
            <div>
              <h3>智能匹配申请信息</h3>
              <p>
                {regenerated
                  ? "已按最新技能重新生成；请复核后继续处理。"
                  : "以原始申请表为底稿，已从附件中提取并补齐的字段以紫色“智能填充”标识。"}
              </p>
            </div>
          </header>
          <div className="organize-form">
            {matched.map((field, i) => {
              const isMissing = !field.value.trim();
              return (
                <label
                  className={`${i >= 13 ? "wide " : ""}${isMissing ? "missing" : ""}`}
                  key={field.label}
                >
                  <span>
                    {field.label}
                    {field.ai && <em className="ai-mark">智能填充</em>}
                    {isMissing && <em className="missing-mark">未匹配</em>}
                  </span>
                  <input
                    value={field.value}
                    placeholder={isMissing ? `请补充${field.label}` : ""}
                    onChange={(e) => change(i, e.target.value)}
                  />
                </label>
              );
            })}
          </div>
          <div className="organize-files">
            <b>匹配后保留的附件材料</b>
            {p.attachments.map((a) => (
              <div key={a}>
                <FileText size={15} />
                {a}
              </div>
            ))}
            <div className="missing-file">
              <FileText size={15} />
              待补充：风险提示说明
            </div>
          </div>
        </section>
      </div>
      <section className="organize-summary">
        <label>
          审核建议总结{" "}
          <small>
            {missing.length
              ? `当前仍有 ${missing.length} 个未匹配字段：${missing.join("、")}`
              : "字段完整，可进行提交预审。"}
          </small>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
      </section>
      <footer>
        <button className="danger" onClick={reject}>
          驳回并通知申请人
        </button>
        <button className="pam-primary" onClick={approve}>
          <Check size={15} />
          通过并送职能审核
        </button>
      </footer>
    </>
  );
}
function PersonalDetail({
  p,
  onClose,
  onSave,
  onSubmit,
  draft,
}: {
  p: Proposal;
  onClose: () => void;
  onSave: (p: Proposal, attachments: string[]) => void;
  onSubmit: (p: Proposal) => void;
  draft: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [attachments, setAttachments] = useState(p.attachments);
  const [fields, setFields] = useState(
    applicationFields.map(([label, value]) => ({
      label,
      value: label === "议案名称" ? p.title : value,
    })),
  );
  const canEdit =
    p.applicant === "王楷煜" &&
    (p.stage === "returned" || p.stage === "votefailed" || draft);
  const change = (i: number, value: string) =>
    setFields((v) => v.map((x, n) => (n === i ? { ...x, value } : x)));
  const save = () => {
    onSave({ ...p, title: fields[0].value }, attachments);
    setEditing(false);
  };
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer personal-drawer">
        <header>
          <div>
            <small>{p.id} · 个人申请详情</small>
            <h2>{p.title}</h2>
            <Status>{p.status}</Status>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <TemplatePin p={p} />
        {p.reason && (
          <section className="return-box">
            <b>处理意见</b>
            <p>{p.reason}</p>
            <small>请按意见修改申请表并补充材料后提交。</small>
          </section>
        )}
        <section className="personal-section">
          <header>
            <div>
              <h3>申请信息</h3>
              <p>请完整维护议案基础信息、决策事项和影响评估。</p>
            </div>
            {canEdit && !editing && (
              <button className="plain" onClick={() => setEditing(true)}>
                <PenLine size={14} />
                修改
              </button>
            )}
          </header>
          <div className="application-form">
            {fields.map((f, i) => (
              <label className={i >= 13 ? "wide" : ""} key={f.label}>
                <span>{f.label}</span>
                {editing ? (
                  <>
                    {["议案类型", "议案来源", "所属部门", "是否紧急"].includes(
                      f.label,
                    ) ? (
                      <select
                        value={f.value}
                        onChange={(e) => change(i, e.target.value)}
                      >
                        <option>{f.value}</option>
                        <option>经营决策类</option>
                        <option>项目投资类</option>
                        <option>是</option>
                        <option>否</option>
                      </select>
                    ) : (
                      <input
                        value={f.value}
                        onChange={(e) => change(i, e.target.value)}
                      />
                    )}
                  </>
                ) : (
                  <b>{f.value}</b>
                )}
              </label>
            ))}
          </div>
        </section>
        <section className="personal-section attachment-section">
          <header>
            <div>
              <h3>附件材料</h3>
              <p>可上传补充材料，或删除不再适用的附件。</p>
            </div>
            {editing && (
              <button
                className="plain"
                onClick={() =>
                  setAttachments((v) => [...v, `补充材料_${v.length + 1}.pdf`])
                }
              >
                + 上传附件
              </button>
            )}
          </header>
          <div className="editable-files">
            {attachments.map((a, i) => (
              <div key={`${a}-${i}`}>
                <span className="file">
                  <FileText size={16} />
                  {a}
                </span>
                {editing && (
                  <button
                    onClick={() =>
                      setAttachments((v) => v.filter((_, n) => n !== i))
                    }
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
        {draft && !editing && (
          <section className="diff personal-diff">
            <header>
              <b>版本比对 · 本次修改</b>
              <span>与上一版本对比</span>
            </header>
            <p>
              <del>处置方式：公开挂牌</del>
              <ins>
                处置方式：{fields.find((f) => f.label === "处置方式")?.value}
              </ins>
            </p>
            <p>
              <del>附件：资产清单.xlsx</del>
              <ins>新增 / 更新附件：{attachments.map((a) => a).join("、")}</ins>
            </p>
            <small>上一轮意见：{p.reason || "请核对议案内容后再提交。"}</small>
          </section>
        )}
        {editing && (
          <footer className="personal-footer">
            <button
              className="plain"
              onClick={() => {
                setEditing(false);
                setAttachments(p.attachments);
              }}
            >
              取消
            </button>
            <button className="pam-primary" onClick={save}>
              <Check size={15} />
              保存
            </button>
          </footer>
        )}
        {draft && !editing && (
          <footer className="personal-footer">
            <span>内容已保存，可重新提交至预审核列表。</span>
            <button
              className="pam-primary"
              onClick={() => {
                onSubmit(p);
                onClose();
              }}
            >
              <Send size={15} />
              提交
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
function Detail({ p, onClose }: { p: Proposal; onClose: () => void }) {
  const fields = applicationFields.map(([label, value]) => [
    label,
    label === "议案名称"
      ? p.title
      : label === "议案来源"
        ? p.source
        : label === "申请人"
          ? p.applicant
          : label === "所属部门"
            ? p.department
            : label === "提交时间"
              ? p.time
              : value,
  ]);
  const showDiff = p.revised || p.stage === "returned";
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer personal-drawer committee-drawer">
        <header>
          <div>
            <small>{p.id} · 议案详情</small>
            <h2>{p.title}</h2>
            <Status>{p.status}</Status>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <TemplatePin p={p} />
        <section className="life">
          <b>全生命周期</b>
          <div>
            {[
              "收集",
              "智能预审",
              "职能审核",
              "议案审核",
              "投票",
              "决议 / 执行",
            ].map((x, i) => (
              <span
                className={
                  i <=
                  (p.stage === "received"
                    ? 0
                    : p.stage === "functional" || p.stage === "returned"
                      ? 2
                      : p.stage === "prepassed"
                        ? 2
                        : p.stage === "audit"
                          ? 3
                          : p.stage === "auditpassed"
                            ? 3
                            : p.stage === "voting"
                              ? 4
                              : 5)
                    ? "done"
                    : ""
                }
                key={x}
              >
                {i + 1}
                <small>{x}</small>
              </span>
            ))}
          </div>
        </section>
        {p.reason && (
          <section className="return-box">
            <b>处理意见</b>
            <p>{p.reason}</p>
            <small>该意见会随驳回记录与版本比对一同保留。</small>
          </section>
        )}
        <section className="personal-section">
          <header>
            <div>
              <h3>申请信息</h3>
              <p>议案完整申请表信息，供委员会查看和流程处理。</p>
            </div>
          </header>
          <div className="application-form readonly-form">
            {fields.map(([label, value], i) => (
              <label className={i >= 13 ? "wide" : ""} key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </label>
            ))}
          </div>
        </section>
        <section className="personal-section attachment-section">
          <header>
            <div>
              <h3>附件材料</h3>
              <p>以下材料与议案申请表一并归档。</p>
            </div>
          </header>
          <div className="editable-files">
            {p.attachments.map((a, i) => (
              <div key={`${a}-${i}`}>
                <span className="file">
                  <FileText size={16} />
                  {a}
                </span>
              </div>
            ))}
          </div>
        </section>
        {showDiff && (
          <section className="diff committee-diff">
            <header>
              <b>版本比对 · 本次修改</b>
              <span>与 V1.0 对比</span>
            </header>
            <p>
              <del>处置方式：公开挂牌</del>
              <ins>处置方式：评估后协议转让</ins>
            </p>
            <p>
              <del>附件：资产清单.xlsx</del>
              <ins>新增：资产评估报告.pdf</ins>
            </p>
            <small>
              保留上一轮意见：请补充资产评估报告，并明确收益测算口径。
            </small>
          </section>
        )}
      </aside>
    </div>
  );
}
function ReviewDetail({
  p,
  onClose,
  onUpdate,
  notice,
  auto = false,
  mode,
}: {
  p: Proposal;
  onClose: () => void;
  onUpdate: (stage: Stage, status: string, reason?: string) => void;
  notice: (s: string) => void;
  auto?: boolean;
  mode: "pre" | "audit";
}) {
  const isPre = mode === "pre";
  const [reviewed, setReviewed] = useState(auto);
  const [advice, setAdvice] = useState(
    p.status.includes("驳回修改")
      ? "已核对驳回修改内容：补充材料与修改事项已基本满足要求；请重点复核风险提示和审批依据后再作出结论。"
      : isPre
        ? "材料完整性基本符合要求；请重点核验制度依据、预算影响和附件是否齐全。"
        : "审核要点基本合理；请重点复核决策权限、制度合规性、预算影响及执行风险。",
  );
  const fields = applicationFields.map(([label, value]) => [
    label,
    label === "议案名称"
      ? p.title
      : label === "议案来源"
        ? p.source
        : label === "申请人"
          ? p.applicant
          : label === "所属部门"
            ? p.department
            : value,
  ]);
  const start = () => {
    setReviewed(true);
    notice(`已完成智能${isPre ? "预审" : "审核"}，建议内容可继续人工修改`);
  };
  const reject = () => {
    onUpdate("returned", "驳回修改", advice);
    notice(`${isPre ? "预审" : "审核"}已驳回，申请人将收到钉钉卡片通知`);
    onClose();
  };
  const pass = () => {
    onUpdate(
      isPre ? "prepassed" : "auditpassed",
      isPre ? "预审通过" : "审核通过",
    );
    notice(`${isPre ? "预审" : "审核"}已通过，议案已进入下一处理环节`);
    onClose();
  };
  const actionLabel = isPre ? "智能预审" : "智能审核";
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer personal-drawer prereview-drawer">
        <header>
          <div>
            <small>
              {p.id} · {isPre ? "职能预审详情" : "议案审核详情"}
            </small>
            <h2>{p.title}</h2>
            <Status>{p.status}</Status>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <TemplatePin p={p} />
        {p.reason && (
          <section className="return-box">
            <b>上一轮驳回意见</b>
            <p>{p.reason}</p>
            <small>如为驳回修改后议案，请结合该意见重点复核。</small>
          </section>
        )}
        <section className="personal-section">
          <header>
            <div>
              <h3>申请信息</h3>
              <p>
                完整申请表信息，供{isPre ? "职能部门预审" : "审核人审核"}使用。
              </p>
            </div>
          </header>
          <div className="application-form readonly-form">
            {fields.map(([label, value], i) => (
              <label className={i >= 13 ? "wide" : ""} key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </label>
            ))}
          </div>
        </section>
        <section className="personal-section attachment-section">
          <header>
            <div>
              <h3>附件材料</h3>
              <p>以下材料与申请表一并归档。</p>
            </div>
          </header>
          <div className="editable-files">
            {p.attachments.map((a, i) => (
              <div key={`${a}-${i}`}>
                <span className="file">
                  <FileText size={16} />
                  {a}
                </span>
              </div>
            ))}
          </div>
        </section>
        {!reviewed ? (
          <footer className="personal-footer">
            <span>
              点击{actionLabel}后，系统会结合已保存的技能生成审核建议。
            </span>
            <button className="pam-primary" onClick={start}>
              <Sparkles size={15} />
              {actionLabel}
            </button>
          </footer>
        ) : (
          <>
            <section className="prereview-advice">
              <header>
                <div>
                  <h3>{isPre ? "预审建议" : "审核建议"}</h3>
                  <p>系统生成的建议可由审核人修改后，再作出处理结论。</p>
                </div>
                <span>智能生成</span>
              </header>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
              />
            </section>
            <footer className="personal-footer">
              <button className="danger" onClick={reject}>
                驳回
              </button>
              <button className="pam-primary" onClick={pass}>
                <Check size={15} />
                通过
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
function ProcessSkills({
  skills,
  setSkills,
  onClose,
  notice,
}: {
  skills: any[];
  setSkills: any;
  onClose: () => void;
  notice: (s: string) => void;
}) {
  const choices = ["organize", "voting", "speech"];
  const [pick, setPick] = useState("organize");
  const current = skills.find((s) => s.id === pick)!;
  const [draft, setDraft] = useState(current.prompt);
  const choose = (id: string) => {
    setPick(id);
    setDraft(skills.find((s) => s.id === id)!.prompt);
  };
  const save = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === pick ? { ...s, prompt: draft, enabled: !!draft.trim() } : s,
      ),
    );
    notice(
      draft.trim()
        ? `“${current.name}”已保存，议案列表将立即使用该技能`
        : `“${current.name}”未保存，相关一键操作已禁用`,
    );
  };
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer process-skills">
        <header>
          <div>
            <small>议案列表 · 流程配置</small>
            <h2>流程技能</h2>
            <p>仅展示本页面实际调用的预审、投票与话术技能。</p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <section className="process-skill-nav">
          {skills
            .filter((s) => choices.includes(s.id))
            .map((s) => (
              <button
                className={pick === s.id ? "selected" : ""}
                onClick={() => choose(s.id)}
                key={s.id}
              >
                <Sparkles size={17} />
                <span>
                  <b>{s.name}</b>
                  <small>
                    {s.enabled ? "已保存 · 已启用" : "未保存 · 已禁用"}
                  </small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
        </section>
        <section className="process-editor">
          <header>
            <div>
              <h3>{current.name}</h3>
              <p>{current.desc}</p>
            </div>
            <Status>{current.enabled ? "已启用" : "未配置"}</Status>
          </header>
          <label>
            技能指令
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="描述字段提取、判断标准、输出格式或话术风格…"
            />
          </label>
          <div className="process-help">
            <Sparkles size={16} />
            {pick === "organize"
              ? "影响“整理并预审”中的字段匹配、缺失提示与预审建议。"
              : pick === "voting"
                ? "影响“投票智能设置”中的标题、说明和附件建议。"
                : "影响投票通过后的“话术生成”内容。"}
          </div>
        </section>
        <footer className="personal-footer">
          <button className="plain" onClick={onClose}>
            关闭
          </button>
          <button className="pam-primary" onClick={save}>
            <Check size={15} />
            保存技能
          </button>
        </footer>
      </aside>
    </div>
  );
}
function WorkModal({
  kind,
  p,
  onClose,
  onUpdate,
  notice,
  skill,
  skills,
  setSkills,
}: {
  kind: string;
  p: Proposal;
  onClose: () => void;
  onUpdate: (stage: Stage, status: string, reason?: string) => void;
  notice: (s: string) => void;
  skill?: boolean;
  skills: any[];
  setSkills: any;
}) {
  const [opinion, setOpinion] = useState(
    "经核验，议案符合当前审核要点，可进入下一环节。",
  );
  const [voteAttachments, setVoteAttachments] = useState(p.attachments);
  const isVote = kind === "vote";
  const isOrganize = kind === "organize";
  const speech = kind === "speech";
  const skillId = isVote ? "voting" : "speech";
  const targetSkill = skills.find((s) => s.id === skillId)!;
  const [editSkill, setEditSkill] = useState(false);
  const [skillDraft, setSkillDraft] = useState(targetSkill?.prompt || "");
  const [generated, setGenerated] = useState(false);
  const [voteTitle, setVoteTitle] = useState(`审议：${p.title}`);
  const [voteDescription, setVoteDescription] = useState(
    "本议案已完成职能预审与议案审核，请各委员阅览附件后在钉钉卡片中投票。",
  );
  const [speechDraft, setSpeechDraft] = useState(
    `【议案审议结果】《${p.title}》已获战略执行委员会投票通过。请相关责任部门依据决议要求推进任务分解与执行，并按节点反馈进展。`,
  );
  const saveAndRegenerate = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === skillId
          ? { ...s, prompt: skillDraft, enabled: !!skillDraft.trim() }
          : s,
      ),
    );
    if (isVote) {
      setVoteTitle(`审议：${p.title}（按最新投票技能生成）`);
      setVoteDescription(
        "已按最新投票智能设置技能重新生成投票说明，请确认附件和投票内容。",
      );
    } else
      setSpeechDraft(
        `【最新决议话术】《${p.title}》投票通过。请相关责任部门依据最新话术要求推进任务分解、执行与进度反馈。`,
      );
    setGenerated(true);
    setEditSkill(false);
    notice(`已按最新“${targetSkill.name}”重新智能生成当前内容`);
  };
  const reject = () => {
    onUpdate(
      "returned",
      kind.includes("functional") ? "职能预审驳回" : "审核驳回",
      opinion,
    );
    notice("已驳回议案，并向申请人发送钉钉卡片通知");
    onClose();
  };
  const approve = () => {
    const functional = kind.includes("functional");
    onUpdate(
      functional ? "prepassed" : "auditpassed",
      functional ? "预审通过" : "审核通过",
    );
    notice(
      functional
        ? "职能预审通过，议案已可提交审核"
        : "审核通过，已可进入投票智能设置",
    );
    onClose();
  };
  const launchVote = () => {
    onUpdate("voting", "投票进行中");
    notice("已确认发起钉钉投票，议案进入投票进行中");
    onClose();
  };
  return (
    <div className="pam-overlay">
      <section className={`pam-modal ${isOrganize ? "organize-modal" : ""}`}>
        <header>
          <div>
            <small>
              {p.id} ·{" "}
              {isVote
                ? "钉钉投票协同"
                : speech
                  ? "决议话术"
                  : isOrganize
                    ? "智能整理与预审"
                    : "审核处理"}
            </small>
            <h2>
              {speech
                ? "投票通过话术草稿"
                : isOrganize
                  ? "整理结果与预审确认"
                  : isVote
                    ? "投票智能设置"
                    : kind.includes("functional")
                      ? "职能部门审核"
                      : "议案审核"}
            </h2>
            <p>{p.title}</p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        {isOrganize ? (
          <OrganizeReview
            p={p}
            onClose={onClose}
            onUpdate={onUpdate}
            notice={notice}
            skills={skills}
            setSkills={setSkills}
          />
        ) : isVote || speech ? (
          <>
            {editSkill && (
              <section className="inline-skill">
                <header>
                  <div>
                    <b>技能配置</b>
                    <small>
                      {targetSkill.name} · 修改后将按新规则重新智能生成当前
                      {isVote ? "投票内容" : "话术"}。
                    </small>
                  </div>
                </header>
                <textarea
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                />
                <footer>
                  <button className="plain" onClick={() => setEditSkill(false)}>
                    取消
                  </button>
                  <button
                    className="pam-primary"
                    disabled={!skillDraft.trim()}
                    onClick={saveAndRegenerate}
                  >
                    <RefreshCw size={14} />
                    保存并重新智能生成
                  </button>
                </footer>
              </section>
            )}
            <div className={isVote ? "vote-form" : "speech"}>
              {isVote ? (
                <>
                  <ContextSkillBar
                    skill={targetSkill}
                    description="用于自动生成钉钉投票标题、说明与随卡发送的附件建议；修改后可立即重新生成。"
                    onClick={() => setEditSkill(true)}
                  />
                  <header className="pane-title">
                    <div>
                      <b>投票内容</b>
                      <p>
                        {generated
                          ? "已按最新投票智能设置技能重新生成，可继续人工调整。"
                          : "确认投票标题、说明和附件后发起。"}
                      </p>
                    </div>
                  </header>
                  <label>
                    投票标题
                    <input
                      value={voteTitle}
                      onChange={(e) => setVoteTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    投票说明
                    <textarea
                      value={voteDescription}
                      onChange={(e) => setVoteDescription(e.target.value)}
                    />
                  </label>
                  <div className="vote-attachments">
                    <header>
                      <b>随卡片发送的附件</b>
                      <button
                        className="plain"
                        onClick={() =>
                          setVoteAttachments((v) => [
                            ...v,
                            `投票补充材料_${v.length + 1}.pdf`,
                          ])
                        }
                      >
                        + 上传附件
                      </button>
                    </header>
                    {voteAttachments.map((a, i) => (
                      <div key={`${a}-${i}`}>
                        <span>
                          <FileText size={15} />
                          {a}
                        </span>
                        <button
                          onClick={() =>
                            setVoteAttachments((v) =>
                              v.filter((_, n) => n !== i),
                            )
                          }
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <ContextSkillBar
                    skill={targetSkill}
                    description="用于按投票结果生成钉钉决议通知与后续执行提醒；修改后可立即重新生成。"
                    onClick={() => setEditSkill(true)}
                  />
                  <header className="pane-title">
                    <div>
                      <b>建议发送话术</b>
                      <p>
                        {generated
                          ? "已按最新决议话术生成技能重新生成，可继续人工调整。"
                          : "确认话术后生成钉钉决议通知。"}
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
                  确认并发起投票
                </button>
              ) : (
                <>
                  <button className="plain" onClick={onClose}>
                    仅保存草稿
                  </button>
                  <button
                    className="pam-primary"
                    onClick={() => {
                      notice("已生成并模拟发送钉钉决议通知");
                      onClose();
                    }}
                  >
                    <Send size={15} />
                    确认生成通知
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
                    ? "职能审核依据"
                    : "审核分析结果"}
                </b>
                <p>
                  {skill
                    ? "系统已基于已保存技能生成建议；请在确认前人工复核。"
                    : "当前为人工审核，请结合申请表及附件填写意见。"}
                </p>
                <div className="review-chips">
                  <span>材料完整性</span>
                  <span>制度依据</span>
                  <span>预算口径</span>
                  <span>专业风险</span>
                </div>
              </section>
              <label>
                审核意见（可人工修改）
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              </label>
            </div>
            <footer>
              <button className="danger" onClick={reject}>
                驳回
              </button>
              <button className="pam-primary" onClick={approve}>
                <Check size={15} />
                通过
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
function App() {
  const { page, setPage } = useHashPage(route);
  const [items, setItems] = useState(original);
  const [skills, setSkills] = useState(skillsSeed);
  const [templates, setTemplates] = useState(templatesSeed);
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
  const [toast, setToast] = useState("");
  const notice = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 3200);
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
    notice("修改已保存，请确认后点击“提交”重新发起审核");
  };
  const submitPersonal = (p: Proposal) => {
    update(p.id, "functional", "驳回修改后 · 待职能预审");
    setDrafts((v) => {
      const n = new Set(v);
      n.delete(p.id);
      return n;
    });
    notice("已提交修改后的议案，系统已保留版本记录并重新发送职能预审");
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
  else if (page === "proposal-list") content = <ProposalList {...common} />;
  else if (page === "pre-review")
    content = (
      <ReviewList
        title="预审核列表"
        desc="职能部门按职责核验议案，支持智能预审建议和人工处理结论。"
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
        title="审核列表"
        desc="面向议案审核人的待办集合，支持智能审核建议和人工处理结论。"
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
    content = <Templates templates={templates} setTemplates={setTemplates} notice={notice} />;
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
          templateCss}
      </style>
      <Shell page={page} setPage={setPage}>
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
