import {
  Activities,
  InforAreas,
  Inscription,
  Navbar,
  Special,
  Welcome,
} from '../../Sections/Public'

export default function Public() {
  return (
    <div>
      <Navbar />
      <Activities />
      <Welcome />
      <Special />
      <Inscription />
      <InforAreas />
    </div>
  )
}
