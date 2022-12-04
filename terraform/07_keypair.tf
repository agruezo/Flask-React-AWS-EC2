resource "aws_key_pair" "production" {
    key_name    = "${var.ecs_cluster_name}_key_pair"
    public_key  = var.ssh_pubkey
}