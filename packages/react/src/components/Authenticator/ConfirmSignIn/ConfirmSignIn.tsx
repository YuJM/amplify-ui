import { I18n } from 'aws-amplify';
import {
  AuthChallengeNames,
  getActorState,
  SignInContext,
  SignInState,
} from '@aws-amplify/ui';

import { useAmplify, useAuth } from '../../../hooks';
import {
  ConfirmationCodeInput,
  ConfirmSignInFooter,
  ConfirmSignInFooterProps,
} from '../shared';

export const ConfirmSignIn = (): JSX.Element => {
  const amplifyNamespace = 'Authenticator.ConfirmSignIn';
  const {
    components: { FieldGroup, Flex, Form, Heading },
  } = useAmplify(amplifyNamespace);

  const [_state, send] = useAuth();
  const actorState: SignInState = getActorState(_state);
  const isPending = actorState.matches('confirmSignIn.pending');

  const footerProps: ConfirmSignInFooterProps = {
    amplifyNamespace,
    isPending,
    send,
  };

  const { challengeName, remoteError } = actorState.context as SignInContext;
  let mfaType: string = 'SMS';
  if (challengeName === AuthChallengeNames.SOFTWARE_TOKEN_MFA) {
    mfaType = 'TOTP';
  }

  const headerText = I18n.get(`Confirm ${mfaType} Code`);

  return (
    <Form
      data-amplify-authenticator-confirmsignin=""
      method="post"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        send({
          type: 'SUBMIT',
          // @ts-ignore Property 'fromEntries' does not exist on type 'ObjectConstructor'. Do you need to change your target library? Try changing the `lib` compiler option to 'es2019' or later.ts(2550)
          data: Object.fromEntries(formData),
        });
      }}
    >
      <Flex direction="column">
        <Heading level={3}>{headerText}</Heading>

        <FieldGroup direction="column" disabled={isPending}>
          <ConfirmationCodeInput
            amplifyNamespace={amplifyNamespace}
            errorText={remoteError}
          />
        </FieldGroup>

        <ConfirmSignInFooter {...footerProps} />
      </Flex>
    </Form>
  );
};
