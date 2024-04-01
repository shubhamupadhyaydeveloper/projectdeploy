import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Text,
    RadioGroup,
    Radio,
    Select,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import {useMutation,useQueryClient} from '@tanstack/react-query'
import useShowToast from './ShowToast'
import {useNavigate} from 'react-router-dom'


export default function Signup() {
    const [value, setValue] = useState('')
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const showToast = useShowToast()
    const { register, handleSubmit, formState: {  errors }, reset } = useForm()
    // api call
    const {isPending,mutateAsync} = useMutation({
        mutationKey : ['createuser'],
        mutationFn : async function (data) {
            try {
                const request = await fetch(`/api/users`, {
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
    
                const response = await request.json()
                console.log(response)
                showToast('User created successful','success')
                navigate('/')
                return response
            } catch (error) {
                console.log('Error in createUse',error.message)
            }
        },
        onSuccess :  () => {
            queryClient.invalidateQueries({queryKey : ['allusers']})
        }
    })

    const handleFromSubmit = async (data) => {
        const userData = {
            firstname : data.firstname,
            lastname : data.lastname,
            gender : value,
            email : data.email,
            domain : data.domain,
            available : data.available
        }

        try {
           const request = await mutateAsync(userData)
        } catch (error) {
            console.log("Error in sendUserdata",error.message)
        }

    }
    return (
        <Stack mx={'auto'} maxW={'lg'} py={12} px={6}
        >
            <Box
                rounded={'lg'}
                color={'black'}
                p={8}>
                <Stack spacing={4}>
                    <form onSubmit={handleSubmit(handleFromSubmit)} >
                        <Flex
                            gap={3}
                            flexDirection={["column", "column", "row", "row", "row"]}
                        >
                            <Box>
                                <FormControl id="firstName" isRequired>
                                    <FormLabel color={"black"}>FirstName</FormLabel>
                                    <Input type="text"
                                        {...register("firstname", { required: "firstname is required" })}
                                    />
                                    {errors.text && <Text color={"red"} fontWeight="semibold" fontSize="sm">{errors.text.message}</Text>}
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName" isRequired>
                                    <FormLabel color={"black"}>LastName</FormLabel>
                                    <Input type="text"
                                        {...register("lastname", { required: "Lastname is reqired" })}
                                    />
                                </FormControl>
                            </Box>
                        </Flex>
                        <FormControl id="email" isRequired mt={3}>
                            <FormLabel color={"black"}>Email address</FormLabel>
                            <Input type="email"
                                {...register("email", { required: "Email is required" })}
                            />
                        </FormControl>


                        <FormControl id="domain" isRequired mt={3}>
                            <FormLabel color={"black"}>Domain</FormLabel>
                            <Input type="text"
                                {...register("domain", { required: "domain is required" })}
                            />
                        </FormControl>


                        <FormControl id="available" isRequired mt={3}>
                            <FormLabel color={"black"}>Availbale</FormLabel>
                            <Select placeholder='Select option' {...register('available')}>
                                <option value='true'>true</option>
                                <option value='false'>false</option>
                            </Select>
                        </FormControl>



                        <RadioGroup onChange={setValue} value={value} mt={4} color={"black"}>
                            <Stack direction='row'>
                                <Radio value='male'>male</Radio>
                                <Radio value='female'>female</Radio>
                            </Stack>
                        </RadioGroup>

                        <Stack spacing={10} pt={2} mt={3}>
                            <Button
                                loadingText="Submitting"
                                disabled={isPending}
                                size="lg"
                                bg={'blue.400'}
                                type='submit'
                                color={'black'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Create User
                            </Button>
                        </Stack>
                    </form>

                </Stack>
            </Box>
        </Stack>

    )
}