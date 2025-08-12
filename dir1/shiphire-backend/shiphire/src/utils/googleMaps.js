import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'

const env = process.env.NODE_ENV || 'LOCAL';
dotenv.config({path: path.join(__dirname, '..', '..', `.env.${env}`)});

export const findCoordinate = async (latitude, longitude) => {
    const url = process.env.GOOGLE_MAPS_URL
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    
    try {
        const response = await axios.get(`${url}${latitude},${longitude}&language=id&key=${apiKey}`)
        const addressComponents = response.data.results[0].address_components
        let province = null
        let city = null

        addressComponents.forEach(component => {
            if (component.types.includes('administrative_area_level_1')) {
                province = component.long_name
            } else if (component.types.includes('administrative_area_level_2')) {
                city = component.long_name.split(' ')[1]
            }
        })

        return {province, city}
    } catch (error) {
        throw error
    }
}