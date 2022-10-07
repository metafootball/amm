network="meer"
if [ ${2} ]
then
    network="${2}"
fi
npx hardhat --network $network run scripts/air/${1}.js