import {
    Form,
    useActionData,
    useLoaderData,
    useNavigation,
    V2_MetaFunction,
} from '@remix-run/react';
import { DataFunctionArgs, json } from '@remix-run/node';
import { Button } from '~/components/ui/Button';
import { decryptString } from '~/utils/encryption/encryption';
import { requestAccessTokenWithMultifactorCode } from '~/utils/auth/riot/auth.server';
import React, { useRef, useState } from 'react';

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
                <Button loading={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
            </span>
        </Form>
    );
};

const MultifactorCodeInput = ({ length }: { length: number }) => {
    const [text, setText] = useState(Array(length).fill(''));
    const refs = Array(length)
        .fill('')
        .map(() => useRef<HTMLInputElement>());

    const focusInput = (index: number, change: number) => {
        const ref = refs[index + change];
        if (ref?.current) {
            ref.current?.focus();
        }
    };

    const handleTextInput = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.split('')[0];
        }
        const code = [...text];
        code[index] = value;
        setText(code);
        focusInput(index, 1);
    };

    const handleTextPaste = (index: number, value: string) => {
        console.log('Inserted', value);
        const code = [...text];
        value.split('').forEach((value, valueIndex, array) => {
            code[index + valueIndex] = value;
        });
        setText(code);
        focusInput(index, value.length);
    };

    const handleDelete = (index: number) => {
        const code = [...text];
        code[index] = '';
        setText(code);
        focusInput(index, -1);
    };

    const onInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const number = parseInt(event.target.value);
        const nativeEvent = event.nativeEvent as InputEvent;

        if (nativeEvent.inputType === 'insertText') {
            if (isNaN(number)) return;
            handleTextInput(index, event.target.value);
        }
        if (nativeEvent.inputType === 'insertFromPaste') {
            console.log('pasted');
            if (isNaN(number)) return;
            handleTextPaste(index, event.target.value);
        }
    };

    return (
        <div className={'mt-5 flex justify-center gap-3'}>
            {text.map((_, index) => (
                <CodeInput
                    innerRef={refs[index]}
                    value={text[index]}
                    onInput={(e) => onInput(e, index)}
                    onBackspace={handleDelete}
                    key={index}
                    index={index}
                />
            ))}
        </div>
    );
};

const CodeInput = ({
    index,
    value,
    onInput,
    onBackspace,
    innerRef,
}: {
    index: number;
    value: number;
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBackspace: (index: number) => void;
    innerRef: React.MutableRefObject<HTMLInputElement | undefined>;
}) => {
    //This logic is to automatically focus the next input after number input or the former if the delete key is pressed

    return (
        <input
            id={index.toString()}
            value={value.toString()}
            onKeyDown={(event) => {
                const nativeEvent = event.nativeEvent;
                if (nativeEvent.code === ('Backspace' || 'Delete')) {
                    onBackspace(index);
                }
            }}
            onChange={(event) => {
                onInput(event);
            }}
            name={'multifactorCode'}
            required={true}
            className={
                'h-12 w-12 appearance-none rounded-md border border-white/30 bg-neutral-900 p-2 text-center text-xl'
            }
            inputMode={'numeric'}
            // @ts-ignore
            ref={innerRef}
        />
    );
};

export default MultifactorLoginPage;
