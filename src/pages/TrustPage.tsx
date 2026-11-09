import { Link } from "react-router-dom";
import { VERIFICATION_DESCRIPTIONS, VERIFICATION_LABELS } from "../data/types";
import { usePageMeta } from "../lib/usePageMeta";
import { Reveal } from "../components/SiteLayout";
import { SectionHeading, VerificationBadge } from "../components/Primitives";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  GlobeIcon,
  MailIcon,
  ShieldCheckIcon,
  SwapIcon,
  UsersIcon,
  WhatsAppIcon,
} from "../components/Icons";

const LEVELS = [
  {
    level: "identidade" as const,
    title: "Identidade verificada",
    what: "A equipa confirmou um documento de identidade e um contacto.",
    not: "Não confirma competência, qualidade de ensino nem antecedentes.",
  },
  {
    level: "comunidade" as const,
    title: "Membro de confiança",
    what: "Três trocas concluídas e pelo menos uma referência da comunidade.",
    not: "Não substitui as avaliações nem garante que a próxima troca corra bem.",
  },
  {
    level: "mentor" as const,
    title: "Mentor verificado",
    what: "Experiência ou credencial profissional confirmada para um saber específico.",
    not: "Não garante disponibilidade, preço justo nem qualidade em todos os temas.",
  },
];

const PACT = [
  {
    title: "Parceria, não serviço",
    text: "A outra pessoa não é um prestador anónimo. É alguém que está a dar tempo e saber.",
  },
  {
    title: "Combinar antes",
    text: "Tempo, local, material e o que cada lado leva. Expectativas claras evitam conflitos.",
  },
  {
    title: "Consentimento",
    text: "Peça autorização antes de gravar, fotografar ou partilhar algo sobre a sessão.",
  },
  {
    title: "Dinheiro fora",
    text: "Não peça nem envie dinheiro, códigos M-Pesa, e-Mola ou transferências.",
  },
  {
    title: "Cuidar dos dados",
    text: "Partilhe apenas o necessário. Não publique moradas ou contactos de outras pessoas.",
  },
  {
    title: "Cancelar com respeito",
    text: "Avise com antecedência. Um cancelamento claro é melhor do que uma ausência.",
  },
];

export function TrustPage() {
  usePageMeta(
    "Confiança e segurança",
    "Como a Percebera verifica perfis, recolhe avaliações e protege a comunidade. O que cada selo confirma e o que não confirma.",
  );

  return (
    <div className="page">
      <section className="page-hero page-hero--statement">
        <div className="container">
          <p className="eyebrow">Confiança e segurança</p>
          <h1 className="display-1 display-1--page">Confiança não se declara. Mostra-se.</h1>
          <p className="page-hero__lead page-hero__lead--wide">
            Cada nível de verificação diz exactamente o que foi confirmado e o que ainda depende
            da comunidade. Nenhum selo substitui o seu julgamento.
          </p>
          <div className="statement-tags">
            <span>Perfis verificados</span>
            <span>Avaliações ligadas a trocas</span>
            <span>Sem dinheiro pelo meio</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Verificação"
              title="Três níveis, com limites claros."
              description="Não existe um selo único que diga tudo. Cada nível cobre uma parte diferente da confiança."
            />
          </Reveal>
          <div className="level-cards">
            {LEVELS.map((item, index) => (
              <Reveal key={item.level} delay={index * 70}>
                <article className="level-card">
                  <div className="level-card__top">
                    <span className="mono-label">Nível 0{index + 1}</span>
                    <VerificationBadge level={item.level} />
                  </div>
                  <h2>{VERIFICATION_LABELS[item.level]}</h2>
                  <p className="level-card__what">{item.what}</p>
                  <p className="level-card__desc">{VERIFICATION_DESCRIPTIONS[item.level]}</p>
                  <div className="level-card__limit">
                    <AlertIcon size={16} />
                    <p>
                      <strong>O que não confirma:</strong> {item.not}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="verification-note">
            <ShieldCheckIcon size={19} />
            <p>
              Antes de qualquer selo, qualquer conta tem um email confirmado. Nesta demonstração,
              os selos são ilustrativos e nenhum documento é verificado.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container trust-story-grid">
          <Reveal>
            <p className="eyebrow">Avaliações</p>
            <h2 className="display-2">Só quem trocou pode avaliar.</h2>
            <p>
              As avaliações não são um mural de opiniões. Cada nota está ligada a uma troca que foi
              marcada como concluída pelas duas pessoas.
            </p>
            <ul className="check-list">
              <li>
                <CheckCircleIcon size={16} />
                Uma avaliação por pessoa e por troca
              </li>
              <li>
                <CheckCircleIcon size={16} />
                Nota de 1 a 5, com um comentário curto
              </li>
              <li>
                <CheckCircleIcon size={16} />
                Removida apenas por violação das regras, não por discordância
              </li>
              <li>
                <CheckCircleIcon size={16} />
                O direito de resposta existe no perfil
              </li>
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="trust-quote">
              <div className="trust-quote__stars">★★★★★</div>
              <blockquote>
                A Amina explicou devagar e adaptou a folha de cálculo ao meu negócio de costura.
                Já consigo ver o lucro de cada peça.
              </blockquote>
              <p>
                <strong>Celina Uamusse</strong> · troca de Excel concluída
              </p>
              <span className="trust-quote__verified">
                <CheckCircleIcon size={14} />
                Avaliação verificada
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="whatsapp">
        <div className="container whatsapp-privacy">
          <Reveal>
            <div className="whatsapp-privacy__head">
              <span className="whatsapp-privacy__icon">
                <WhatsAppIcon size={27} />
              </span>
              <div>
                <p className="eyebrow">WhatsApp e privacidade</p>
                <h2 className="display-2">O contacto certo, sem expor o número.</h2>
                <p>
                  A conversa entre as duas pessoas acontece no WhatsApp, mas o número não precisa
                  de ser público. O perfil e a oferta nunca mostram o número. A ligação só é
                  partilhada depois de uma proposta aceite.
                </p>
              </div>
            </div>
          </Reveal>
          <div className="whatsapp-privacy__grid">
            <Reveal>
              <article className="whatsapp-step">
                <span>01</span>
                <h3>Use um nome de utilizador</h3>
                <p>
                  No WhatsApp, escolha um nome de utilizador que não revele o seu número. É a forma
                  mais simples de manter a privacidade quando participa numa troca.
                </p>
              </article>
            </Reveal>
            <Reveal delay={70}>
              <article className="whatsapp-step">
                <span>02</span>
                <h3>Aceite primeiro</h3>
                <p>
                  A ligação só aparece depois de a proposta ser aceite. Antes disso, a conversa
                  fica no pedido dentro da Percebera, sem contacto directo.
                </p>
              </article>
            </Reveal>
            <Reveal delay={140}>
              <article className="whatsapp-step">
                <span>03</span>
                <h3>Partilhe só o necessário</h3>
                <p>
                  Combine horário e local na conversa. Não envie códigos, documentos ou dados
                  bancários. Pode alterar ou remover o nome de utilizador quando quiser.
                </p>
              </article>
            </Reveal>
          </div>
          <div className="whatsapp-privacy__note">
            <ShieldCheckIcon size={19} />
            <p>
              <strong>Nesta demonstração:</strong> os nomes de utilizador são fictícios e nenhum
              número é partilhado. O botão abre o WhatsApp com uma mensagem pronta e deixa-o
              escolher o contacto. Em produção, abriria a conversa com a pessoa certa através do
              nome de utilizador.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Acordo comunitário"
              title="Regras simples para uma troca respeitosa."
              description="Ao entrar na Percebera, cada membro concorda com estes princípios. Não são letras pequenas."
            />
          </Reveal>
          <div className="pact-grid">
            {PACT.map((item, index) => (
              <Reveal key={item.title} delay={index * 50}>
                <article className="pact-card">
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="safety-band">
        <div className="container safety-grid">
          <div>
            <p className="eyebrow">Dinheiro</p>
            <h2 className="display-2">A Percebera não pede códigos. Nunca.</h2>
            <p>
              Trocas diretas não têm dinheiro pelo meio. Se alguém pedir um código M-Pesa, e-Mola,
              transferência ou pagamento para “reservar” uma sessão, pare.
            </p>
            <div className="safety-actions">
              <div>
                <span>1</span>
                <p>Não envie nada e não partilhe códigos.</p>
              </div>
              <div>
                <span>2</span>
                <p>Guarde a conversa e avise a equipa.</p>
              </div>
              <div>
                <span>3</span>
                <p>Bloqueie a pessoa e procure outra troca.</p>
              </div>
            </div>
          </div>
          <div className="safety-card">
            <SwapIcon size={22} />
            <h3>O que a plataforma nunca faz</h3>
            <ul>
              <li>Não pede pagamento para ativar uma conta.</li>
              <li>Não pede o seu PIN ou código de confirmação.</li>
              <li>Não garante resultados de aprendizagem.</li>
            </ul>
            <a
              className="btn btn--accent btn--sm"
              href="mailto:simplyallan@outlook.com?subject=Seguran%C3%A7a%20na%20Percebera"
            >
              <MailIcon size={15} />
              Falar com a equipa
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="acessibilidade">
        <div className="container">
          <div className="policy-grid">
            <Reveal>
              <article className="policy-card">
                <span className="policy-card__icon">
                  <UsersIcon size={21} />
                </span>
                <h2>Menores de idade</h2>
                <p>
                  Um menor só participa com consentimento do responsável. A sessão deve acontecer
                  com o responsável presente ou num espaço supervisionado. Não são permitidos
                  encontros privados nem pernoitas.
                </p>
              </article>
            </Reveal>
            <Reveal delay={60}>
              <article className="policy-card">
                <span className="policy-card__icon">
                  <ShieldCheckIcon size={21} />
                </span>
                <h2>Denúncias e mediação</h2>
                <p>
                  Nesta demonstração, os mecanismos de denúncia e mediação são ilustrativos. Em
                  produção, cada perfil e cada troca terá um botão de denúncia com resposta da
                  equipa e registo de segurança.
                </p>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className="policy-card">
                <span className="policy-card__icon">
                  <GlobeIcon size={21} />
                </span>
                <h2>Dados e privacidade</h2>
                <p>
                  Nesta demonstração, ofertas e propostas ficam no seu navegador. A
                  inscrição na lista de espera envia email e LinkedIn à equipa, sem publicidade e
                  sem venda de dados. Em produção, haverá direito de acesso, correção e eliminação.
                </p>
              </article>
            </Reveal>
            <Reveal delay={180}>
              <article className="policy-card">
                <span className="policy-card__icon">
                  <GlobeIcon size={21} />
                </span>
                <h2>Acessibilidade e dados</h2>
                <p>
                  Sem fotografias pesadas, com navegação por teclado, contraste cuidado e
                  português simples. O próximo passo é um modo de poupança de dados e acesso por
                  SMS ou USSD para zonas com pouca ligação. Está no roteiro, não no produto actual.
                </p>
              </article>
            </Reveal>
          </div>
          <div className="demo-disclosure">
            <AlertIcon size={18} />
            <p>
              <strong>Sobre esta demonstração:</strong> verificação, denúncias e mediação são
              ilustrativas. Nenhum documento é verificado e nenhuma troca é mediada por uma equipa
              real. Use os perfis de exemplo para testar o mecanismo de troca.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">Próximo passo</p>
            <h2 className="display-2">Uma comunidade segura começa com pessoas informadas.</h2>
            <p>Entre na lista de lançamento e receba o guia de primeira troca.</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/lista-de-espera" className="btn btn--accent btn--lg">
              Entrar na lista
              <ArrowRightIcon size={17} />
            </Link>
            <Link to="/como-funciona" className="btn btn--secondary btn--lg">
              Como funciona
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
