const mongose=require("mongoose")


    const dbConnection=()=>{
        mongose.connect(process.env.DB_URL).then((conn)=>{
            console.log(`connection`,conn.connection.host)
            })
            // .catch((err)=>{
            // console.log(err)
            // })
        
    }

    module.exports=dbConnection