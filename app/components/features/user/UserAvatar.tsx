import { User } from '~/utils/auth/user.server';

export const UserAvatar = ({ user }: { user: User }) => {
    return (
        <section>
            <img className={'h-8 rounded-full'} src={user.avatarUrl} alt='' />
        </section>
    );
};
