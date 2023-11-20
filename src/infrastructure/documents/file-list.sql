// FindAllUsers.ts

import { UserRepository } from '../../domain/repositories/UserRepository';

// Clase que representa un caso de uso para encontrar todos los usuarios
export class FindAllUsers {
    // Inversión de dependencias: la dependencia UserRepository se inyecta a través del constructor.
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;   // Asigna la instancia de UserRepository a la propiedad privada userRepository
    }

    async run() {
        // Retorna la lista de usuarios encontrados.
        return await this.userRepository.findAllUsers();
    }
}

// UserModel.ts

// Definición de la clase UserModel
export class UserModel {
    // Propiedades privadas de la clase
    private id: string;
    private name: string;
    private email: string;

    // Constructor de la clase
    constructor(id: string, name: string, email: string) {
        // Inicialización de las propiedades con los valores proporcionados
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Métodos de acceso para obtener los valores de las propiedades privadas
    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getEmail(): string { return this.email; }

    // Método estático para crear una instancia de UserModel
    public static create(id: string, name: string, email: string): UserModel {
        // Llamada al constructor utilizando la palabra clave 'new'
        return new UserModel(id, name, email);
    }
}

// UserRepository.ts

import { WithId, Document } from "mongodb";

// Interfaz que define los métodos que debe implementar un repositorio de usuarios.
export interface UserRepository {
    findAllUsers(): Promise<WithId<Document>[]>;
}

// UserController.ts

import { FindAllUsers } from "../../application/user-use-cases/FindAllUsers";

// Clase que representa el controlador de usuarios
export class UserController {
    // Constructor que recibe una instancia de FindAllUsers como parámetro
    constructor(
        public findAllUsers: FindAllUsers
    ) { }

    // Controlador para obtener todos los usuarios.
    getAllUsers() {
        const users = this.findAllUsers.run();  // Ejecuta la función 'run' del caso de uso FindAllUsers para obtener todos los usuarios
        return users; // Retorna la lista de usuarios directamente
    }
}

// userDependencies.ts

import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { FindAllUsers } from "../../application/user-use-cases/FindAllUsers";

// Investigar como funciona un contenedor de dependencias como TypeDi, Inversify, etc.

// Creación de instancias y configuración de inyección de dependencias.

// Creamos una instancia de MongoUserRepository, que es una implementación de UserRepository.
const userRepository = new MongoUserRepository();

// Inversión de dependencias: Pasamos la instancia de userRepository como argumento en la creación de instancias de los casos de uso.
export const findAllUsers = new FindAllUsers(userRepository);

// Inyección de dependencias: Pasamos las instancias de los casos de uso como argumentos en la creación de la instancia de UserContoller.
export const userController = new UserController(
    findAllUsers
);


// BadRequestError.ts

// Definimos una clase BadRequestError que extiende de la clase Error.
export class BadRequestError extends Error {
    // Definimos dos propiedades adicionales para la clase BadRequestError.
    // Estas propiedades se utilizan para almacenar información adicional sobre el error.
    statusCode: number;
    code: string;

    // Constructor de la clase BadRequestError que recibe un mensaje como parámetro.
    constructor(message: string) {
        // Llamamos al constructor de la clase Error con el mensaje proporcionado.
        super(message);
        // Establecemos la propiedad statusCode con el valor 400, que corresponde al código de estado HTTP 400 (Bad Request).
        this.statusCode = 400;
        // Establecemos la propiedad code con el valor 'BAD_REQUEST', que es un identificador para este tipo de error.
        this.code = 'BAD_REQUEST';
    }
}

// ErrorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './BadRequestError';
import { NotFoundError } from './NotFoundError';

export class ErrorHandler {
    static handleError(error: any, request: Request, response: Response, next: NextFunction): void {
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            // Manejo específico para errores personalizados
            const errorDetails = {
                status: error.statusCode,
                code: error.code,
                message: error.message,
                // Otras propiedades adicionales específicas del error...
            };
            response.status(error.statusCode).json({ error: errorDetails });
        } else {
            // Manejo de errores genéricos
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || 'Internal Server Error';
            const errorDetails = {
                status: statusCode,
                message: errorMessage,
            };
            response.status(statusCode).json({ error: errorDetails });
        }
    }
}

// NotFoundError.ts

// Definimos una clase NotFoundError que extiende de la clase Error.
export class NotFoundError extends Error {
    // Definimos dos propiedades adicionales para la clase NotFoundError.
    // Estas propiedades se utilizan para almacenar información adicional sobre el error.
    statusCode: number;
    code: string;

    // Constructor de la clase NotFoundError que recibe un mensaje como parámetro.
    constructor(message: string) {
        // Llamamos al constructor de la clase Error con el mensaje proporcionado.
        super(message);
        // Establecemos la propiedad statusCode con el valor 404, que corresponde al código de estado HTTP 404 (Not Found).
        this.statusCode = 404;
        // Establecemos la propiedad code con el valor 'NOT_FOUND', que es un identificador para este tipo de error.
        this.code = 'NOT_FOUND';
    }
}

// userMiddlewares.ts

import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../error/ErrorHandler";

export const userValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Lógica para validar y procesar la solicitud antes de insertar el usuario
        if (!req.body.name || !req.body.email) {
            return res.status(400).json({ error: 'Name, Email are required fields.' });
        }
        // Si los datos son válidos, continuamos con la siguiente función de middleware o el controlador.
        next();
    } catch (error) {
        // Capturamos cualquier error y lo manejamos con ErrorHandler.
        ErrorHandler.handleError(error, req, res, next);
    }
};

export const exerciseValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.name ||
            !req.body.typeOfExercise ||
            !req.body.series ||
            !req.body.repetitions ||
            !req.body.rest ||
            !req.body.weight
        ) {
            return res.status(400).json({ error: 'The fields (name, typeOfExercise, series, repetitions, rest, weight) are required.' });
        }
        next();
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
}

// Connection.ts

import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();    // Carga las variables de entorno desde .env

// Función para establecer una conexión con la base de datos
export const dbConnection = async (): Promise<Db> => {
    // Obtiene la cadena de conexión a la base de datos desde las variables de entorno
    const mongodbCnn = process.env.MONGODB_CNN;
    // Verifica si la cadena de conexión está definida
    if (!mongodbCnn) {
        throw new Error("MONGODB_CNN environment variable is not defined");
    }

    try {
        // Crea una instancia del cliente de MongoDB usando la cadena de conexión
        const client = new MongoClient(mongodbCnn);
        // Conecta al cliente con el servidor de MongoDB
        await client.connect();
        // Obtiene una instancia de la base de datos
        const db = client.db();
        // Retorna la instancia de la base de datos
        return db;
    } catch (error) {
        throw new Error("Error when starting the database");
    }
};


// MongoUserRepository.ts

// Importa las interfaces y tipos necesarios de MongoDB y la función de conexión a la base de datos
import { Collection, WithId, Document } from "mongodb";
import { dbConnection } from "../mongodb/connections/Connection";

// Importa la interfaz UserRepository desde el dominio
import { UserRepository } from "../../domain/repositories/UserRepository";

// Clase que implementa la interfaz UserRepository y se conecta a MongoDB
export class MongoUserRepository implements UserRepository {
    // Propiedad privada que representa la colección de usuarios en la base de datos
    private collection?: Collection;

    constructor() { this.connect();}

    //  Establece la conexión con la base de datos.
    private async connect(): Promise<void> {
        const db = await dbConnection();
        this.collection = db.collection('users');
        if (!this.collection) {
            throw new Error('The connection to the users Collection of the database is not established');
        }
    }

    // Obtiene todos los usuarios de la base de datos.
    async findAllUsers(): Promise<WithId<Document>[]> {
        try {
            const userDocs = await this.collection!.find().toArray();
            return userDocs;
        } catch (error: any) {
            throw new Error("Error getting users list");
        }
    }
    
}

// userRouter.ts

import express, { NextFunction, Request, Response } from "express";
import { userController } from '../dependency-injection/userDependencies';
import { ErrorHandler } from "../error/ErrorHandler";

// Creamos el enrutador para la entidad 'usuarios'
export const userRouter = express.Router();

// Definir la ruta GET /users en el enrutador userRouter
userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos todos los usuarios desde el controlador usando el caso de uso getAllUsers
        const users = await userController.getAllUsers();
        return res.json({ users });
    } catch (error) {
        ErrorHandler.handleError(error, req, res, next);
    }
});


// Server.ts

import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { userRouter } from '../routes/userRoutes';
import { ErrorHandler } from '../error/ErrorHandler';

dotenv.config();    // Carga las variables de entorno desde .env

export class Server {
    public app: Application;
    public port: string | number;
    public usersRoutePath: string;

    constructor() {
        this.app = express();   // Creamos una instancia de Express para la aplicación
        this.port = process.env.PORT || 3000;   // Definimos la ruta base para las rutas relacionadas con usuarios
        this.usersRoutePath = '/gym';   // Definimos la ruta base para las rutas relacionadas con usuarios
        this.middleware();  // Configuramos los middleware de la aplicación
        this.routes();  // Configuramos las rutas de la aplicación
    }

    // Método para configurar los middleware de la aplicación
    middleware() {
        this.app.use(cors());   // Configura el middleware de CORS para permitir el acceso a recursos de otros servidores
        this.app.use(express.json());   // Configura el middleware para leer y analizar el cuerpo de las solicitudes como JSON
        this.app.use((error: any, request: Request, response: Response, next: NextFunction) => {
            // Configuramos el middleware global para manejar errores
            ErrorHandler.handleError(error, request, response, next);
        });
    }

    // Método para configurar las rutas de la aplicación
    routes() {
        this.app.use(this.usersRoutePath, userRouter);  // Configurar las rutas en la aplicación Express
    }

    // Método para iniciar el servidor y escuchar en el puerto configurado
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ', this.port);
        });
    }

}

// app.ts

import { Server } from "./infrastructure/servers/Server";

const server = new Server();    // Crea una instancia del servidor.

server.listen();    // Inicia el servidor y lo pone en escucha de solicitudes.



// .env

MONGODB_CNN="mongodb+srv://poner-----nombre-base-de-datos--------.mongodb.net/gymDB"
PORT=8080


// package.json

{
    "name": "skeleton-api-rest-full",
    "version": "1.0.0",
    "description": "Añadir una description",
    "main": "index.js",
    "scripts": {
      "start": "node dist/app.js",
      "dev": "nodemon src/app.ts",
      "build": "tsc",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "Hector Orlando",
    "license": "UPAJE",
    "dependencies": {
      "@types/express": "^4.17.21",
      "@types/node": "^20.9.0",
      "cors": "^2.8.5",
      "dotenv": "^16.3.1",
      "express": "^4.18.2",
      "mongoose": "^8.0.0",
      "ts-node": "^10.9.1",
      "typescript": "^5.2.2"
    },
    "devDependencies": {
      "@types/cors": "^2.8.16",
      "@types/dotenv": "^8.2.0",
      "nodemon": "^3.0.1"
    }
  }
  


// tsconfig.json

{
    "compilerOptions": {
      /* Visit https://aka.ms/tsconfig to read more about this file */
  
      /* Projects */
      // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
      // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
      // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
      // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
      // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
      // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */
  
      /* Language and Environment */
      "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
      // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
      // "jsx": "preserve",                                /* Specify what JSX code is generated. */
      // "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
      // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
      // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
      // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
      // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
      // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
      // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
      // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
      // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */
  
      /* Modules */
      "module": "commonjs",                                /* Specify what module code is generated. */
      // "rootDir": "./",                                  /* Specify the root folder within your source files. */
      // "moduleResolution": "node10",                     /* Specify how TypeScript looks up a file from a given module specifier. */
      // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
      // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
      // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
      // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
      // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
      // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
      // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
      // "allowImportingTsExtensions": true,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
      // "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
      // "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
      // "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
      // "resolveJsonModule": true,                        /* Enable importing .json files. */
      // "allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
      // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */
  
      /* JavaScript Support */
      // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
      // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
      // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */
  
      /* Emit */
      // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
      // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
      // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
      // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
      // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
      // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
      "outDir": ".dist/",                                   /* Specify an output folder for all emitted files. */
      // "removeComments": true,                           /* Disable emitting comments. */
      // "noEmit": true,                                   /* Disable emitting files from a compilation. */
      // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
      // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
      // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
      // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
      // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
      // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
      // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
      // "newLine": "crlf",                                /* Set the newline character for emitting files. */
      // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
      // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
      // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
      // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
      // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
      // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */
  
      /* Interop Constraints */
      // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
      // "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
      // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
      "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
      // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
      "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
  
      /* Type Checking */
      "strict": true,                                      /* Enable all strict type-checking options. */
      // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
      // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
      // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
      // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
      // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
      // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
      // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
      // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
      // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
      // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
      // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
      // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
      // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
      // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
      // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
      // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
      // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
      // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */
  
      /* Completeness */
      // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
      "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
    },
    "exclude": [
      "node_modules"
    ]
  }
  
// pregunta
basandome en el archivo package.json
dame los pasos para crear este proyecto desde cero.
ejemplo:
npm init -y
npm install express mongoose typescript @types/node @types/express ts-node nodemon --save (favor poner todas las dependencias en una sola sentencia.)
npx tsc --init

favor detallar los pasos uno por uno asi lo incluyo en mi archivo README.md


// pregunta 2
si clono este proyecto desde gitHub
cuales son los pasos para arrancar el proyecto, favor enumerarlos para después añadirlos a mi archivo README.md 