import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 font-display text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="mb-10">
        <p className="mb-2 font-display text-sm tracking-[0.2em] text-primary uppercase">
          // legal
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: March 2025</p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to my personal portfolio website. Your privacy is important to me. This Privacy Policy
            explains how I collect, use, and safeguard any information you provide when you visit this site
            or use the contact form.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">2. Information I Collect</h2>
          <p className="leading-relaxed">
            When you use the contact form on this website, I may collect your name, email address, and the
            content of your message. I do not collect any other personal data, and I do not use cookies for
            tracking or advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">3. How I Use Your Information</h2>
          <p className="leading-relaxed">
            Any information you submit through the contact form is used solely to respond to your inquiry.
            Your details are never sold, rented, or shared with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">4. Data Storage & Security</h2>
          <p className="leading-relaxed">
            Messages submitted via the contact form are stored securely. I take reasonable steps to protect
            your information from unauthorized access or disclosure. However, no method of transmission over
            the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">5. Third-Party Links</h2>
          <p className="leading-relaxed">
            This website may contain links to external sites such as Instagram. I am not responsible for the
            privacy practices of those sites and encourage you to review their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">6. Your Rights</h2>
          <p className="leading-relaxed">
            You have the right to request access to, correction of, or deletion of any personal data you
            have submitted. To make such a request, please contact me using the contact form on this site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">7. Changes to This Policy</h2>
          <p className="leading-relaxed">
            I may update this Privacy Policy from time to time. Any changes will be reflected on this page
            with an updated date at the top.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">8. Contact</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please reach out via the{" "}
            <Link to="/#contact" className="text-primary hover:underline">
              contact form
            </Link>{" "}
            on this website.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
