# ✨ YatoERD

YatoERD is a web-based Entity-Relationship Diagram design tool.

## ✨ Preview

![image](https://github.com/user-attachments/assets/a175186f-519c-4cdc-95a7-fe1e303c611a)

<https://github.com/user-attachments/assets/d5139915-f2a6-44d4-a76c-7db11570e34c>

## ✨ Roadmap

- [x] Add table, edit table
- [x] Auto layout
- [x] Export as JSON, PNG, JPEG, SVG
- [x] Dark/Light mode
- [ ] Export as MySQL, PostgreSQL file
- [ ] Access diagram online (e.g., from Google Drive)
- [ ] Support multilingual
- [ ] Drag and drop table columns to reorder

## ✨ Setup

Make sure to have node js and install the dependencies:

```bash
npm install
```

## ✨ Development

To run the development server:

```bash
npm run dev
```

If you prefer to use docker for development, you can use the following command:

```bash
docker-compose up
```

## ✨ Production

To build the project:

```bash
npm run build
node .output/server/index.mjs
```

If you prefer to use docker for production, you can use the following command:

```bash
docker-compose -f docker-compose.prod.yml up
```

## ✨ Hosting

YatoERD is simple to host, and you can use hosting services like Vercel, Netlify to deploy without any problem. However, if you prefer to host it on your server, you can use the following command:

```bash
git clone https://github.com/SeakMengs/yato-erd
cd yato-erd
docker-compose -f docker-compose.prod.yml up
```

## ✨ Testing

To perform unit test run the following command:

```bash
npm run test
```

## ✨ Contribute

- Feel free to open an issue or pull request if you have any idea or found any bug
- If you want to support me, you can [buy me a coffee](https://www.buymeacoffee.com/seakmeng)

## ✨ Inspiration

- Excalidraw
- DrawSQL
- Draw.io
