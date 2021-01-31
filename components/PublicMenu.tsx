import { AvailableLanguages, LanguageStringsStructure } from '../lib/languages';
import siteInfo                                         from '../const/siteInfo';
import React                                            from 'react';
import LanguageContext                                  from './LanguageContext';
import Link                                             from 'next/link';
import { useRouter }                                    from 'next/router';
import useSWR                                           from 'swr';
import { fetcher }                                      from '../lib/swrHelper';

const languageStrings: LanguageStringsStructure & {
	'en-US': {
		about: string,
		signIn: string,
		pricing: string,
		profile: string,
	},
} = {
	'en-US': {
		about: 'About',
		signIn: 'Sign Up / Sign in',
		pricing: 'Pricing',
		profile: 'My Profile',
	},
};

interface MenuItem {
	label: string,
	classNames?: string,  // ''
	collapsable?: boolean,  // true
}

const menuItemsDictionary = (language: AvailableLanguages['type']): (
	Record<'left' | 'right' | 'right_signed_in', Record<string, MenuItem>>
	) => (
	{
		'left': {
			'/': {
				label: siteInfo[language].title,
				classNames: 'font-bold bg-clip-text bg-gradient-to-l ' +
					'from-yellow-400 to-purple-400 text-transparent',
				collapsable: false,
			},
			'/about': {
				label: languageStrings[language].about,
			},
			'/pricing': {
				label: languageStrings[language].pricing,
			},
		},
		'right': {
			'/sign_in': {
				label: languageStrings[language].signIn,
			},
		},
		'right_signed_in': {
			'/profile': {
				label: languageStrings[language].profile,
			},
		},
	}
);

const MenuItems = ({
	menuItems,
	currentPage,
}: {
	menuItems: Record<string, MenuItem>,
	currentPage: string,
}) => <div className='flex gap-x-4 items-center'>{
	Object.entries(menuItems).map(([linkPath, menuItem], index) =>
		<Link
			href={linkPath}
			key={index}
		>
			<a className={
				`hover:text-black
				${
					menuItem.classNames ||
					(
						currentPage === linkPath ?
							'text-gray-300 underline' :
							'text-gray-600'
					)
				}`
			}>{menuItem.label}</a>
		</Link>,
	)
}</div>;

export function PublicMenu() {

	const {route} = useRouter();
	const { data:isUserAuthorized, error } = useSWR('/api/is_user_authorized',fetcher);

	return <LanguageContext.Consumer>{
		(language) => <header className='p-4 border-b mb-4'>
			<div className="container flex flex-wrap justify-between max-w-screen-lg mx-auto">
				<MenuItems currentPage={route} menuItems={menuItemsDictionary(language).left} />
				<MenuItems
					currentPage={route}
					menuItems={menuItemsDictionary(language)[
						(error || !isUserAuthorized) ?
							'right' :
							'right_signed_in'
						]}
				/>
			</div>
		</header>
	}</LanguageContext.Consumer>;
}