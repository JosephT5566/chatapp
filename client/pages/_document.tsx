import React from 'react';
import { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../styles/theme';

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="zh-TW">
				<Head>
					<link rel="icon" href="/favicon.png" />
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
						rel="stylesheet"
					/>
					<meta property="og:title" content="Chat App" />
					<meta property="og:description" content="Chat App" />
					<meta property="og:type" content="website" />
					<meta property="og:image" content="/cover.jpg" />
					<meta property="og:site_name" content="Chat App" />
					{/* <meta property="og:url" content="https://josephtseng-tw.com/" /> */}
					<meta name="description" content="Chat App" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Lobster&family=Vidaloka&family=Montserrat&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}

	static async getInitialProps(ctx: DocumentContext) {
		// Render app and page and get the context of the page with collected side effects.
		const sheets = new ServerStyleSheets();
		const originalRenderPage = ctx.renderPage;

		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
			});

		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			// Styles fragment is rendered after the app and page rendering finish.
			styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
		};
	}
}
