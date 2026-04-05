'use client';

import {
  ChevronDown,
  Mail,
  MessageCircle,
  Plus,
  Search,
  Split,
  TimerReset,
  Webhook,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const triggerBlocks = [
  { label: 'Form Submission', icon: MessageCircle },
  { label: 'Webhook', icon: Webhook },
] as const;

const actionBlocks = [
  { label: 'WhatsApp', icon: MessageCircle },
  { label: 'CRM Sync', icon: Split },
  { label: 'Send Email', icon: Mail },
] as const;

const logicBlocks = [
  { label: 'Wait Delay', icon: TimerReset },
  { label: 'Split Path', icon: Split },
] as const;

export function AutomationsPage() {
  return (
    <section className="flowbuilder-page">
      <aside className="flowbuilder-sidebar">
        <div className="flowbuilder-sidebar-head">
          <strong>Flow Builder</strong>
          <small>v2.4 Active • Draft Mode</small>
        </div>

        <div className="flowbuilder-group">
          <span>Triggers</span>
          {triggerBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <button key={block.label} type="button" className="flowbuilder-side-item">
                <span className="flowbuilder-side-icon">
                  <Icon size={16} />
                </span>
                {block.label}
              </button>
            );
          })}
        </div>

        <div className="flowbuilder-group">
          <span>Actions</span>
          {actionBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <button key={block.label} type="button" className="flowbuilder-side-item">
                <span className="flowbuilder-side-icon">
                  <Icon size={16} />
                </span>
                {block.label}
              </button>
            );
          })}
        </div>

        <div className="flowbuilder-group">
          <span>Logic</span>
          {logicBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <button key={block.label} type="button" className="flowbuilder-side-item">
                <span className="flowbuilder-side-icon is-logic">
                  <Icon size={16} />
                </span>
                {block.label}
              </button>
            );
          })}
        </div>

        <button type="button" className="flowbuilder-add-btn">
          <Plus size={16} />
          Add Component
        </button>
      </aside>

      <main className="flowbuilder-canvas">
        <div className="flowbuilder-canvas-top">
          <div className="flowbuilder-flow-title">
            <strong>Boas-vindas WhatsApp</strong>
            <span>Draft Mode</span>
          </div>

          <div className="flowbuilder-toolbar">
            <button type="button" className="flowbuilder-icon-btn">
              <Search size={15} />
            </button>
            <button type="button" className="flowbuilder-icon-btn">
              <ZoomIn size={15} />
            </button>
            <button type="button" className="flowbuilder-zoom-pill">
              85%
            </button>
            <button type="button" className="flowbuilder-icon-btn">
              <ZoomOut size={15} />
            </button>
          </div>

          <button type="button" className="flowbuilder-test-btn">
            Test Flow
          </button>
        </div>

        <div className="flowbuilder-grid">
          <div className="flowbuilder-node flowbuilder-node-trigger">
            <span className="flowbuilder-node-tag">Trigger</span>
            <strong>New Lead</strong>
            <small>Facebook Ads API</small>
            <span className="flowbuilder-node-dot" />
          </div>

          <div className="flowbuilder-connector" />

          <div className="flowbuilder-node flowbuilder-node-wait">
            <span className="flowbuilder-node-tag">Logic</span>
            <strong>Wait</strong>
            <small>Delay 5 min</small>
          </div>

          <div className="flowbuilder-connector vertical" />

          <div className="flowbuilder-node flowbuilder-node-action is-selected">
            <span className="flowbuilder-node-tag">Action</span>
            <strong>Send Message</strong>
            <small>WhatsApp Confirmation</small>
          </div>
        </div>
      </main>

      <aside className="flowbuilder-properties">
        <div className="flowbuilder-properties-head">
          <strong>Node Properties</strong>
          <button type="button">×</button>
        </div>

        <div className="flowbuilder-selected-card">
          <div className="flowbuilder-selected-icon">
            <MessageCircle size={18} />
          </div>
          <div>
            <span>WhatsApp Action</span>
            <strong>Send Message</strong>
          </div>
        </div>

        <label className="flowbuilder-field">
          <span>Message Template</span>
          <button type="button" className="flowbuilder-select">
            Welcome New Lead - Variant A
            <ChevronDown size={16} />
          </button>
        </label>

        <div className="flowbuilder-field">
          <div className="flowbuilder-field-row">
            <span>Message Preview</span>
            <small>Characters: 124/1024</small>
          </div>
          <div className="flowbuilder-preview-box">
            <p>Olá {'{{first_name}}'}!</p>
            <p>
              Obrigado por se cadastrar na Growth Ops. Recebemos seu interesse e logo um
              especialista entrará em contato. Enquanto isso, tem algo específico que gostaria de
              saber?
            </p>
          </div>
        </div>

        <div className="flowbuilder-field">
          <span>Options</span>
          <div className="flowbuilder-toggle-row">
            <span>Retry on failure</span>
            <button type="button" className="flowbuilder-toggle is-on" />
          </div>
          <div className="flowbuilder-toggle-row">
            <span>Track link clicks</span>
            <button type="button" className="flowbuilder-toggle" />
          </div>
        </div>

        <div className="flowbuilder-properties-actions">
          <button type="button" className="flowbuilder-danger-btn">
            Delete Node
          </button>
          <button type="button" className="flowbuilder-apply-btn">
            Apply Changes
          </button>
        </div>
      </aside>
    </section>
  );
}
