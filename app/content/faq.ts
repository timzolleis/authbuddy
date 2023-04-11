type FAQItem = {
    title: string;
    body: string;
};

export const faq: FAQItem[] = [
    {
        title: 'How does this work?',
        body: 'You can choose this service as an OAUTH Service for the Riot Games Auth api. It will handle the authentication (with multifactor support) for you, and provide you with the respective tokens you need for interacting with the Riot Games API.',
    },
    {
        title: 'Is it safe to use?',
        body: 'Your credentials are never sent to any other party than Riot Games directly and are never stored by our service. As the application that requests the authentication does not receive your credentials, this application can be regarded as safe to use. If you want, check out our source code on GitHub to see for yourself :)',
    },
];
