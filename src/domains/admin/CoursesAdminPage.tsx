'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch, ApiFetchError } from '@/shared/lib/api';
import { FadeIn, StaggerGroup, StaggerItem } from '@/shared/ui/motion/MotionPrimitives';

type CourseItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
};

type CoursesResponse = {
  items: CourseItem[];
  meta: { total: number };
};

type CourseForm = {
  title: string;
  slug: string;
  description: string;
  status: string;
};

const emptyForm: CourseForm = {
  title: '',
  slug: '',
  description: '',
  status: 'DRAFT',
};

export function CoursesAdminPage() {
  const [data, setData] = useState<CoursesResponse | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('Carregando cursos...');
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    try {
      const response = await apiFetch<CoursesResponse>('/v2/courses');
      setData(response);
      setMessage(`Total: ${response.meta.total}`);
    } catch (error) {
      setMessage(error instanceof ApiFetchError ? error.message : 'Falha ao carregar cursos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function validateForm() {
    if (!form.title.trim()) {
      setMessage('Informe o titulo do curso.');
      return false;
    }

    if (!form.slug.trim()) {
      setMessage('Informe o slug do curso.');
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentId = editingId;
    setMessage(currentId ? 'Atualizando curso...' : 'Criando curso...');

    try {
      await apiFetch(currentId ? `/v2/courses/${currentId}` : '/v2/courses', {
        method: currentId ? 'PATCH' : 'POST',
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || undefined,
          status: form.status,
        }),
      });

      setForm(emptyForm);
      setEditingId(null);
      await refresh();
      setMessage(currentId ? 'Curso atualizado' : 'Curso criado');
    } catch (error) {
      setMessage(error instanceof ApiFetchError ? error.message : 'Falha ao salvar curso');
    }
  }

  function startEdit(course: CourseItem) {
    setEditingId(course.id);
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description || '',
      status: course.status,
    });
  }

  async function removeCourse(id: string) {
    setMessage('Removendo curso...');
    try {
      await apiFetch(`/v2/courses/${id}`, { method: 'DELETE' });
      await refresh();
      setMessage('Curso removido');
    } catch (error) {
      setMessage(error instanceof ApiFetchError ? error.message : 'Falha ao remover curso');
    }
  }

  const courses = data?.items ?? [];

  return (
    <section className="hero-surface wide-page">
      <div className="dashboard-grid">
        <div className="stack">
          <FadeIn delay={0.05}>
            <p className="eyebrow">Admin</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2>Cursos</h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p>
              O formulario precisa viver como um painel de operacao e a lista como um inventario
              visual do dominio.
            </p>
          </FadeIn>
          <div className="summary-row" style={{ marginTop: 16 }}>
            <div className="pill">{message}</div>
            <div className="pill pill-ghost">{loading ? 'Sincronizando...' : 'Core'}</div>
            <div className="pill pill-ghost">Catalogo real</div>
          </div>
        </div>

        <div className="workspace-side-stack">
          <div className="panel panel-accent">
            <strong>Direcao desktop</strong>
            <p>
              O formulario precisa viver como um painel de operacao e a lista como um inventario.
            </p>
          </div>
          <div className="panel">
            <strong>Regras de edicao</strong>
            <p>
              Cada curso deve manter um rastro claro de status para facilitar publicar, editar ou
              arquivar.
            </p>
          </div>
        </div>
      </div>

      <div className="form-builder-grid" style={{ marginTop: 18 }}>
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <div className="panel-head">
            <strong>{editingId ? 'Editar curso' : 'Novo curso'}</strong>
            <span className="pill pill-ghost">Catalogo</span>
          </div>
          <StaggerGroup className="stack" delayChildren={0.05} staggerChildren={0.06}>
            <StaggerItem>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Titulo"
                required
              />
            </StaggerItem>
            <StaggerItem>
              <input
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({ ...current, slug: event.target.value }))
                }
                placeholder="Slug"
                required
              />
            </StaggerItem>
            <StaggerItem>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Descricao"
                rows={4}
              />
            </StaggerItem>
            <StaggerItem>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
              >
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </StaggerItem>
            <StaggerItem>
              <button type="submit" disabled={loading}>
                {editingId ? 'Salvar alteracoes' : 'Criar curso'}
              </button>
            </StaggerItem>
          </StaggerGroup>
        </form>

        <div className="stack">
          <div className="panel panel-accent">
            <strong>Lista operacional</strong>
            <p>
              A lista deve funcionar como inventario visual do catalogo, sem perder o foco de
              acao.
            </p>
          </div>
          <StaggerGroup className="stack" delayChildren={0.12} staggerChildren={0.08}>
            {courses.map((course) => (
              <StaggerItem key={course.id}>
                <article className="panel">
                  <div className="panel-head">
                    <strong>{course.title}</strong>
                    <span className="badge badge-draft">{course.status}</span>
                  </div>
                  <p>{course.description}</p>
                  <div className="summary-row">
                    <span className="pill pill-ghost">{course.slug}</span>
                  </div>
                  <div className="summary-row">
                    <button type="button" onClick={() => startEdit(course)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => removeCourse(course.id)}>
                      Excluir
                    </button>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
