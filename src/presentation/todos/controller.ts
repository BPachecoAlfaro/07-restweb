import { Request, Response } from "express";
import { prisma } from "../../data/postgres";


export class TodosController {

    //* DI
    constructor() {}

    public getTodos = async(req: Request, res: Response) => {
    
        const todosFromDb = await prisma.todo.findMany();
        return res.json(todosFromDb);
    }

    public getTodoById = async( req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN( id ) ) return res.status(400).json( { eror: 'ID argument is not a number'});

        const todoById = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        ( todoById )
            ? res.json(todoById)
            : res.status(404).json( { error: `TODO with id ${ id }not found` } ) 

    }

    public createTodo = async ( req: Request, res: Response ) => {
        const { text } = req.body;
        if ( !text) return res.status(400).json({ error: 'Text property is required' });

        const todo = await prisma.todo.create({
            data: { text }
        })

        res.json( todo );
    };

    public updateTodo = async( req: Request, res: Response ) => {

        const id = +req.params.id;
        if ( isNaN( id ) ) return res.status(400).json( { eror: 'ID argument is not a number'})
        const { text, completedAt } = req.body;

        const todoById = await prisma.todo.update({
            where: {
                id: id
            },
            data: {
                text: text,
                completedAt: (completedAt) ? new Date(completedAt) : null,
            }
        });

        if ( !todoById ) return res.status(404).json( { error: `Todo with id ${ id } not found`} )

        res.json( todoById );

    };

    public deleteTodo = async( req: Request, res: Response ) => {

        const id = +req.params.id;
        if ( isNaN( id ) ) return res.status(400).json( { error: 'ID argument is not a number'});
        if ( !id ) return res.status(400).json( { error: `ID property is required`} );

        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        })

        if ( !todo ) return res.status(404).json( { error: `Todo with id ${ id } not found`} );

        const todoToDelete = await prisma.todo.delete({
            where: {
                id: id
            }
        });

        (todoToDelete)
            ? res.json( todoToDelete )
            : res.status(400).json({ error: `Todo with id ${ id } not found`})
       

    };

}