import { FastFoodApp } from "./infrastructure/api";
import PrismaDBConnection from "./infrastructure/database/prisma/PrismaDBConnection";

async function init() {
    const fastFoodApp = new FastFoodApp();
    const dbConnection = new PrismaDBConnection();
    await dbConnection.connect()
    
    fastFoodApp.start(dbConnection);
}

init();