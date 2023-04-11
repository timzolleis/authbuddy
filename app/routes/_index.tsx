import type { V2_MetaFunction } from '@remix-run/react';
import { Button } from '~/ui/components/button/Button';
import { Accordion, AccordionBody, AccordionHeader, AccordionList } from '@tremor/react';
import { faq } from '~/content/faq';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy' }];
};

export default function Index() {
    return (
        <section className={'grid h-full w-full place-items-center lg:mt-20'}>
            <div className={'h-full lg:w-1/2'}>
                <h1 className={'text-display-medium font-black lg:w-2/3'}>
                    Ready to use authentication for your{' '}
                    <span className={'rounded bg-red-500 px-3 py-1'}>VALORANT*</span> projects.
                </h1>
                <h3 className={'mt-2 text-neutral-300'}>
                    AuthBuddy helps you authenticate your users with the Riot Games Auth APIs by
                    providing a simple and secure OAUTH authentication flow - so you can dedicate
                    your time to building features instead of fiddling around with user
                    authentication
                </h3>
                <section className={'mt-5 flex items-center gap-2'}>
                    <Button>Developer Sign in</Button>
                    <Button color={'secondary'}>User Sign in</Button>
                    <Button color={'secondary'} external={true}>
                        GitHub
                    </Button>
                </section>
                <p className={'mt-10 text-sm text-neutral-500'}>
                    *This project is not affiliated with or endorsed by in any way Riot Games, Inc.{' '}
                    <br />
                    VALORANT is a registered trademark of Riot Games, Inc.
                </p>
                <FAQComponent />
            </div>
        </section>
    );
}

const FAQComponent = () => {
    return (
        <AccordionList className={'mt-2 space-y-2'}>
            {faq.map((item) => (
                <Accordion key={item.title} className={'rounded-md border-0 bg-neutral-800'}>
                    <AccordionHeader className={'font-semibold'}>{item.title}</AccordionHeader>
                    <AccordionBody className={'text-sm text-neutral-300'}>
                        {item.body}
                    </AccordionBody>
                </Accordion>
            ))}
        </AccordionList>
    );
};
