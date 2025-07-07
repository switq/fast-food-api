import { FastFoodApp } from "./api";
import { DbConnectionPrisma } from "./infrastructure/database/prisma/DbConnectionPrisma";

const dbconnection = new DbConnectionPrisma();
const fastFoodApp = new FastFoodApp(dbconnection);
fastFoodApp.start();
