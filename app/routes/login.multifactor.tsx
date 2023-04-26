import {
    Form,
    useActionData,
    useLoaderData,
    useNavigation,
    V2_MetaFunction,
} from '@remix-run/react';
import { DataFunctionArgs, json } from '@remix-run/node';
import { Button } from '~/ui/components/button/Button';
import { decryptString } from '~/utils/encryption/encryption';
import { requestAccessTokenWithMultifactorCode } from '~/utils/auth/riot/auth.server';
import { da } from 'date-fns/locale';
import React, { useState } from 'react';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy | Multifactor' }];
};

export const loader = async ({ request }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const codeLength = parseInt(url.searchParams.get('length') || '6');
    const email = url.searchParams.get('email') || 'UNKOWN_EMAIL';

    return json({ email, codeLength });
};

export const action = async ({ request }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const encryptedAsid = url.searchParams.get('asid');
    if (!encryptedAsid) {
        throw new Error('Asid missing in URL');
    }
    const encryptedClid = url.searchParams.get('clid');
    if (!encryptedClid) {
        throw new Error('Clid missing in URL');
    }
    const cookies = [decryptString(encryptedAsid), decryptString(encryptedClid)];
    const formData = await request.formData();
    const codeDigits = formData.getAll('multifactorCode');
    const code = codeDigits.join('');
    try {
        const { accessToken } = await requestAccessTokenWithMultifactorCode({ code, cookies });
    } catch (e) {
        return json({ error: 'The code you entered is incorrect or has been used before.' });
    }

    return null;
};

const MultifactorLoginPage = () => {
    const { email, codeLength } = useLoaderData<typeof loader>();
    const data = useActionData<{ error?: string }>();
    const navigation = useNavigation();
    const loading = navigation.state !== 'idle';
    return (
        <Form method={'post'}>
            <p className={'text-center text-headline-medium font-bold'}>
                Multifactor authentication
            </p>
            <p className={'text-center text-sm text-neutral-400'}>
                Please enter the MFA code that has been sent to {email} down below.
            </p>
            <MultifactorCodeInput length={codeLength} />
            <p className={' mt-2 text-center text-sm text-red-500'}>{data?.error}</p>
            <span className={'mt-5 flex justify-end'}>
                <Button font={'medium'} width={'full'} loading={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
            </span>
        </Form>
    );
};

//TODO: Enable pasting and fix multi-digit input
const MultifactorCodeInput = ({ length }: { length: number }) => {
    const [text, setText] = useState();
    const codeLengthArray: number[] = [];
    //Little trick to be able to create n instances of the input
    for (let i = 0; i < length; i++) {
        codeLengthArray.push(i);
    }
    return (
        <div className={'mt-5 flex justify-center gap-3'}>
            {codeLengthArray.map((i) => (
                <CodeInput key={i} index={i} />
            ))}
        </div>
    );
};

const CodeInput = ({ index }: { index: number }) => {
    return (
        <input
            id={index.toString()}
            //This logic is to automatically focus the next input after number input or the former if the delete key is pressed
            onKeyUp={(event) => {
                const currentElement = document.getElementById(
                    index.toString()
                ) as HTMLInputElement | null;
                //Checking if the current input is empty prevents the cursor skipping an input field
                if (event.code === 'Backspace' && !currentElement?.value) {
                    const element = document.getElementById((index - 1).toString());
                    if (element) element.focus();
                }
            }}
            onInput={(event) => {
                const nativeEvent = event.nativeEvent as InputEvent;
                const updatedIndex = nativeEvent.inputType === 'insertText' ? index + 1 : index - 1;
                const element = document.getElementById(updatedIndex.toString());
                if (element) {
                    element.focus();
                }
            }}
            name={'multifactorCode'}
            required={true}
            maxLength={1}
            className={
                'h-12 w-12 appearance-none rounded-md border border-white/30 bg-neutral-900 p-2 text-center text-xl'
            }
            type='number'
            inputMode={'numeric'}
        />
    );
};

export default MultifactorLoginPage;
