import { Form, useLoaderData, useNavigation, V2_MetaFunction } from '@remix-run/react';
import { DataFunctionArgs, json } from '@remix-run/node';
import { Button } from '~/ui/components/button/Button';
import { decryptString } from '~/utils/encryption/encryption';
import { requestAccessTokenWithMultifactorCode } from '~/utils/auth/riot/auth.server';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy | Multifactor' }];
};

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const codeLength = parseInt(url.searchParams.get('length') || '6');
    const email = url.searchParams.get('email') || 'UNKOWN_EMAIL';
    const codeLengthArray: number[] = [];
    //Little trick to be able to create n instances of the input
    for (let i = 0; i < codeLength; i++) {
        codeLengthArray.push(i);
    }
    return json({ email, codeLengthArray });
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
    const { accessToken } = await requestAccessTokenWithMultifactorCode({ code, cookies });
    return null;
};

const MultifactorLoginPage = () => {
    const { email, codeLengthArray } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const loading = navigation.state !== 'idle';
    return (
        <Form method={'post'}>
            <p className={'text-title-medium font-bold'}>Multi-factor authentication required</p>
            <p className={'text-sm text-neutral-400'}>
                Please enter the MFA code that has been sent to {email} down below.
            </p>
            <div className={'mt-2 flex justify-center gap-3'}>
                {codeLengthArray.map((i) => (
                    <CodeInput index={i} key={i} />
                ))}
            </div>
            <span className={'mt-5 flex justify-end'}>
                <Button font={'medium'} width={'full'} loading={loading}>
                    {loading ? 'Logging you in' : 'Submit'}
                </Button>
            </span>
        </Form>
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
                'h-10 w-10 rounded-md border border-white/30 bg-neutral-900 p-2 text-center text-xl md:h-12 md:w-12'
            }
            type='text'
        />
    );
};

export default MultifactorLoginPage;
