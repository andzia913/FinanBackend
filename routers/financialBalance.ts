import { Request, Response, Router } from "express";
import { BalanceRecord } from "../record/balance.record";
import { CategoryRecord } from "../record/category.record";
import { TypeRecord } from "../record/type.record";

export const financialBalanceRouter = Router();

financialBalanceRouter
        .get('/types', async(req: Request, res:Response) => {
        const types = await TypeRecord.listAll();
        // console.log(types)
        res.json(
        types);
    })
        .get('/categories', async(req: Request, res:Response) => {
        const categories = await CategoryRecord.listAll();
        // console.log(categories)
        res.json(
            categories);
        })
        .get('/get-one/:id', async ( req: Request, res: Response) => {
          try {
            const id = req.params.id;
            const record = await BalanceRecord.getOne(id);
            if (record) {
              res.json(record);
              console.log(record[0])
            } else {
              res.status(404).json({ error: 'Rekord o podanym id nie istnieje.' });
            }
          } catch (error) {
            console.error('Błąd podczas pobierania rekordu:', error);
            res.status(500).json({ error: 'Wystąpił błąd serwera.' });
          }
        })
        .get('/', async(req: Request, res:Response) => {
            const financialBalance = await BalanceRecord.listAll();
            // console.log(financialBalance)
            res.json(
                financialBalance);
        })
        .post('/add', async (req: Request, res: Response) => {
            try {
              const formData = req.body;
              const insertedId = await new BalanceRecord(formData).insert()
              
            //   const insertedId = formData;
              res.status(201).json({ id: insertedId });
            } catch (error) {
                console.error('Błąd podczas przetwarzania żądania:', error);
                res.status(500).json({ error: 'Błąd podczas przetwarzania żądania' });
             }
          })
        .delete('/delete/:id', async (req: Request, res: Response)=>{
          const id = req.params.id;
          try {
            const recordToDelete = await BalanceRecord.getOne(id);
        
            if (!recordToDelete) {
              res.status(404).json({ error: "Rekord o podanym ID nie istnieje." });
            } else {
              await recordToDelete.delete();
              res.status(204).send();
            }
          } catch (error) {
            console.error("Błąd podczas usuwania rekordu:", error);
            res.status(500).json({ error: "Błąd podczas usuwania rekordu" });
          }
        })
        .put('/update/:id', async (req: Request, res: Response) => {
          const id = req.params.id;
          const updatedData = req.body;
        
          try {
            const recordToUpdate = await BalanceRecord.getOne(id);
        
            if (!recordToUpdate) {
              res.status(404).json({ error: "Rekord o podanym ID nie istnieje." });
            } else {
              await recordToUpdate.update(updatedData);
              res.status(200).json({ message: "Rekord zaktualizowany pomyślnie." });
            }
          } catch (error) {
            console.error("Błąd podczas aktualizacji rekordu:", error);
            res.status(500).json({ error: "Błąd podczas aktualizacji rekordu" });
          }
        });
