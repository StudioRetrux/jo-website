/** Copy is verbatim from the design — Figma 1327:6615 (terms) and 1327:6478 (privacy). */
export type LegalKind = "terms" | "privacy";

type LegalPage = {
  title: string;
  navLabel: string;
  path: string;
  description: string;
  paragraphs: readonly string[];
};

export const LEGAL_PAGES: Record<LegalKind, LegalPage> = {
  terms: {
    title: "Terms of Use",
    navLabel: "Home / Terms of Use",
    path: "/terms",
    description:
      "The terms and conditions governing the use of Yohanes Alexander's website and services.",
    paragraphs: [
      "This Terms and Conditions document outlines the rules and regulations for using our services. We value your engagement and want to ensure that you understand your rights and responsibilities while using our platform.",
      "By accessing or using our services, you agree to comply with these terms. We encourage you to read this document thoroughly to familiarize yourself with our policies. Your continued use of our services signifies your acceptance of these terms.",
      "We reserve the right to modify these terms at any time. Any changes will be communicated to you, and your continued use of the services after such modifications will constitute your acceptance of the new terms.",
      "Our services may include various features, and we strive to provide a seamless experience. However, we cannot guarantee uninterrupted access or that the services will be free from errors. We appreciate your understanding and patience as we work to improve our offerings.",
      "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. If you suspect any unauthorized use of your account, please notify us immediately.",
      "We are committed to protecting your rights and ensuring a safe environment for all users. If you have any questions or concerns regarding these Terms and Conditions, please reach out to our support team for assistance.",
      "Thank you for choosing our services and for your cooperation in adhering to these terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    navLabel: "Home / Privacy Policy",
    path: "/privacy",
    description:
      "How Yohanes Alexander collects, uses and safeguards your personal information.",
    paragraphs: [
      "This privacy policy outlines our commitment to safeguarding your personal information. We recognize the importance of your privacy and have implemented measures to ensure that your data is collected, used, and protected responsibly. Our primary goal is to enhance your experience with our services while maintaining the confidentiality of your information.",
      "We collect various types of information, including personal details and usage data, to improve our offerings. This data is utilized solely for the purpose of providing you with a seamless experience and is not shared with any third parties without your explicit consent. We believe in transparency and want you to feel secure when using our services.",
      "By using our services, you agree to the terms outlined in this policy. We encourage you to read this document carefully to understand how we handle your information. Regular reviews of this policy are recommended to stay updated on our practices and any changes that may occur.",
      "Your trust is paramount to us, and we are dedicated to ensuring that your personal information is handled with the utmost care. We have established protocols to protect your data from unauthorized access and breaches. Our team is continuously monitoring and improving our security measures to keep your information safe.",
      "In the event of any changes to our privacy practices, we will notify you promptly. We value your feedback and are always looking for ways to enhance our privacy policy. Your input helps us create a better experience for all users.",
      "We also provide options for you to manage your personal information, including the ability to access, modify, or delete your data. If you have any questions or concerns regarding our privacy policy, please do not hesitate to reach out to our support team.",
      "We are committed to creating a secure environment for your personal information. Our privacy policy is designed to protect your rights and ensure that your data is used responsibly. We appreciate your trust in us and strive to maintain that trust through our actions.",
      "As we continue to evolve, we will keep you informed about any updates to our privacy policy. Your privacy is our priority, and we are dedicated to upholding the highest standards in data protection. Thank you for choosing our services and for your continued support.",
    ],
  },
};
