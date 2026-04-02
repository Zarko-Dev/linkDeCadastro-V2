import Link from 'next/link';

import { ZyrErrorState } from '@/shared/ui/zyr/ZyrStates';

export default function NotFound() {
  return (
    <main className="landing-shell" style={{ display: 'grid', placeItems: 'center' }}>
      <section
        style={{
          width: 'min(100%, 880px)',
          padding: 0,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <ZyrErrorState
          title="Zyr nao encontrou essa rota na V2"
          description="A pagina que voce tentou abrir nao existe ou ainda nao foi ligada ao novo workspace. Volte para o dashboard e siga por uma area valida da plataforma."
          action={<Link href="/dashboard">Voltar ao dashboard</Link>}
        >
          <p className="muted" style={{ margin: 0 }}>
            Se essa tela deveria existir, vale revisar a rota ou terminar a integracao dela na V2.
          </p>
        </ZyrErrorState>
      </section>
    </main>
  );
}
