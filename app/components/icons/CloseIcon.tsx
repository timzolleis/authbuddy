import { icon, IconProps } from '~/components/icons/Icon';

interface CloseIconProps extends IconProps {
    onClick: () => any;
}

export const CloseIcon = ({ color, size, hover, onClick }: CloseIconProps) => {
    return (
        <svg
            onClick={onClick}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={icon({ color, size, hover })}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
    );
};
