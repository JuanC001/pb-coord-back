import { app } from './app'
import swaggerDocs from './config/swagger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
    swaggerDocs(app, Number(PORT));
});