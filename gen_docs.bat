@REM https://typedoc.org/guides/options/

call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/assetContract.ts --out documentations/chaincode/assetContract 
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/assetContractOther.ts --out documentations/chaincode/assetContractOther
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/docType.ts --out documentations/chaincode/docType
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/index.ts --out documentations/chaincode/index
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/membershipHandler.ts --out documentations/chaincode/membershipHandler
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/realEstate.ts --out documentations/chaincode/realEstate
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/realEstateContract.ts --out documentations/chaincode/realEstateContract
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/user.ts --out documentations/chaincode/user
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/userContract.ts --out documentations/chaincode/userContract
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/resources/classOwnership.ts --out documentations/chaincode/resources/classOwnership
call npx typedoc --tsconfig ./chaincode/tsconfig.json --entryPoints chaincode/src/resources/classRoomType.ts --out documentations/chaincode/resources/classRoomType

call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/auth.ts --out documentations/api/auth
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/env.ts --out documentations/api/env
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/fabric.ts --out documentations/api/fabric
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/fabricFunctions.ts --out documentations/api/fabricFunctions
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/index.ts --out documentations/api/index
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/server.ts --out documentations/api/server
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/tokenFunctions.ts --out documentations/api/tokenFunctions
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/router/assets.ts --out documentations/api/router/assets
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/router/realEstates.ts --out documentations/api/router/realEstates
call npx typedoc --tsconfig ./api/tsconfig.json --entryPoints api/src/router/users.ts --out documentations/api/router/users