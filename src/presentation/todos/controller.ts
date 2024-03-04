import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


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
        const [error, createTodoDto] = CreateTodoDto.create( req.body );
        if ( error ) return res.status(400).json({ error })

        const todo = await prisma.todo.create({
            data: createTodoDto!
        })

        res.json( todo );
    };

    public updateTodo = async( req: Request, res: Response ) => {

        const id = +req.params.id;
        const [error, updateTodoDto ] = UpdateTodoDto.create({...req.body, id});
        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.findFirst({
            where: {
                id
            }
        });

        if ( !todo ) return res.status(404).json( { error: `Todo with id ${ id } not found`} )

        const updatedTodo = await prisma.todo.update({
            where: {
                id: id
            },
            data: updateTodoDto!.values
        });


        res.json( updatedTodo );

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